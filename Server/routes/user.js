const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Flow = require('../models/flow');
const Module = require("../models/module");
const UserFlow = require('../models/userFlow');
const Stage = require('../models/stage');
const Role = require("../models/role");
const Token = require("../models/token");
const Metrics = require("../models/metrics")
const verifyToken = require("../middlewares/verifyToken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateProgress, sendResetPasswordEmail } = require("../utils/routeUtils");

router.get("", [verifyToken, authMiddleware.isAdmin], async (req, res) => {
	User.find({}, { password: 0 }, (err, users) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
		return res.status(200).json({ users });
	}).populate({ path: 'role', model: Role });
});

router.get("/:user_id", [verifyToken, authMiddleware.isAdmin], async (req, res) => {
	const _id = req.params.user_id;
	User.findOne({ _id: _id }, { password: 0 }, (err, user) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
		return res.status(200).json({ user });
	}).populate({ path: 'role', model: Role });
});

router.delete("/:user_id", [verifyToken, authMiddleware.isAdmin], async (req, res) => {
	const _id = req.params.user_id;
	User.deleteOne({ _id: _id }, (err, user) => {
		if (err) {
			return res.status(404).json({
				err
			});
		}
		return res.status(200).json({
			user
		});
	});
});

router.post("/changePassword", [verifyToken], async (req, res) => {
	const user = User.findOne({ _id: req.user }, (err) => {
		if (err) {
			return res.status(404).json({
				err
			});
		}
	});
	//checking password
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		return res.status(400).send("Invalid password!");
	} else {
		//hash password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(req.body.password, salt);
		user.updatedAt = Date.now();
		user.save((err) => {
			if (err) {
				res.status(500).send({ message: err });
				return;
			}
			return res.send({ message: "Password was updated successfully!" });
		});
	}
});

router.post("/sendEmailResetPassword/:email", async (req, res) => {
	const email = req.params.email
	const user = await User.findOne({ email: email }, err => {
		if (err) {
			return res.status(404).json({
				err
			});
		}
	})
	if (!user) {
		return res.status(404).json({
			err: "Email not found"
		});
	}
	// Send confirmation email
	sendResetPasswordEmail(user, res, req);
	return res.status(200).json({
		ok: true
	});
});

router.post("/resetPassword/:token", async (req, res) => {
	const token = req.params.token;
	const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash(req.body.password, salt);
	// Find a matching token
	Token.findOne({ token: token }, function (err, token) {
		if (!token) return res.status(400).send({ type: 'not-token', msg: 'We were unable to find a valid token. Your token my have expired.' });
		// If found, find matching user
		User.findOne({ _id: token._userId }, function (err, user) {
			if (!user) return res.status(400).send({ type: 'USER_NOT_FOUND', msg: 'We were unable to find a user for this token.' });
			user.password = password;
			user.updatedAt = Date.now();
			user.save((err) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				return res.send({ message: "Password was updated successfully!" });
			});
		});
	});
});

router.put("/:user_id", async (req, res) => {
	const _id = req.params.user_id;
	const user = await User.findOne({ _id: _id }, (err) => {
		if (err) {
			return res.status(404).json({
				err
			});
		}
	}).populate({ path: 'role', model: Role });
	user.updatedAt = Date.now();
	user.save((err, user) => {
		if (err) {
			return res.status(404).json({
				err
			});
		}
		return res.status(200).json({
			user
		});
	});
});

router.get("/:flow_id/findTestUser", async (req, res) => {
	const flow_id = req.params.flow_id;
	// Find flow
	const flow = await Flow.findOne({ _id: flow_id }, (err) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
	});
	// Find User
	const user = await User.findOne({ email: flow_id + "@test.com" });
	return res.status(200).json({
		ok: true,
		user
	});
});
router.get("/:flow_id/resetTestUser", async (req, res) => {
	const flow_id = req.params.flow_id;
	// Find flow
	const flow = await Flow.findOne({ _id: flow_id }, (err) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
	});
	// Find User
	const user = await User.findOne({ email: flow_id + "@test.com" });
	await UserFlow.deleteOne({ user: user._id }, err => {
		if (err) {
			return res.status(500).json(err);
		}
	})
	/*Find flow modules*/
	const modules = await Module.find({ flow: flow }, (err) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
	});
	// Find flow stages
	const stages = await Stage.find({ flow: flow }, (err) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
	}).sort({ step: 'asc' });
	// Generate user flow progress entry
	generateProgress(modules, stages, user, flow)
		.catch((err) => {
			return res.status(404).json({
				ok: false,
				err,
			});
		})
		.then((progress) => {
			return res.status(200).json({
				user
			});
		});
});

//Valentina

//Método para verificar la existencia de un usuario por el email
router.get("/getUserByEmail/:user_email", async (req, res) => {
	//checking if email exists
	const user = await User.findOne(
		{ email: req.params.user_email.toLowerCase() }, { password: 0 }, err => {
			if (err) {
				res.status(400).send(err)
			}
		}).populate({ path: 'role', model: Role });
	if (!user) return res.status(400).json({ status: 400, message: "EMAIL_NOT_FOUND" })
	//checking role
	if (user.role.name !== 'admin') return res.status(400).json({ status: 400, message: "ROLE_INCORRECT" });
	//checking confirmed
	if (!user.confirmed) return res.status(400).json({ status: 400, message: "USER_NOT_CONFIRMED" });
	res.status(200).json({ user });
});

router.get("/getUsersByStudy/:study_id", async (req, res) => {
	const study_id = req.params.study_id;
	UserFlow.find({ flow: study_id }, (err, userFlows) => {
		if (err) {
			return res.status(404).json({
				ok: false,
				err,
			});
		}
		let userIds = userFlows.map(userFlow => userFlow.user);
		User.find({ _id: { $in: userIds } }, { password: 0 }, (err, users) => {
			if (err) {
				return res.status(404).json({
					ok: false,
					err,
				});
			}
			res.status(200).json({ users });
		}).populate({ path: 'role', model: Role });
	});
});

router.get("/getMetricsByStudy/:study_id", async (req, res) => {
	const study_id = req.params.study_id;
	console.log('Entra aqui')
	console.log(study_id)
	try {
		const users = await User.find({ flow: study_id });
		console.log('users: ',users)
		if (!users.length) {
			return res.status(404).json({ status: 404, message: "Users not found" });
		}

		const userIds = users.map(user => user._id);

		const metrics = await Metrics.find({ userId: { $in: userIds } });
		console.log(metrics)
		if (!metrics.length) {
			return res.status(404).json({ status: 404, message: "Metrics not found" });
		}

		res.status(200).json(metrics);

	} catch (error) {
		console.error(`Error: ${error}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;