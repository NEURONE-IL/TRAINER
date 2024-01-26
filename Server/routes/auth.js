const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserData = require("../models/userData");
const Role = require("../models/role");
const Flow = require("../models/flow");
const Module = require("../models/module");
const Stage = require("../models/stage");
const UserFlow = require("../models/userFlow");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const authMiddleware = require("../middlewares/authMiddleware");
const fs = require("fs");
const { isValidObjectId } = require("mongoose");
const {
  generateProgress,
  sendConfirmationEmail
} = require("../utils/routeUtils");

router.post(
  "/registerAdmin",
  [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Role
    const role = await Role.findOne({ name: "admin" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    //create user
    const user = new User({
      email: req.body.email.toLowerCase(),
      password: hashpassword,
      names: req.body.names,
      last_names: req.body.last_names,
      role: role._id,
      confirmed: true
    });
    //save user in db
    await user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
      return res.status(200).json({
        user
      });
    });
  }
);

router.post(
  "/register",
  [authMiddleware.verifyBodySimple, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Role
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    //create user
    const user = new User({
      email: req.body.email.toLowerCase(),
      password: hashpassword,
      names: req.body.names,
      last_names: req.body.last_names,
      role: role._id
    });
    //save user in db
    await user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
      return res.status(200).json({
        user
      });
    });
  }
);

router.post(
  "/legacySignup/:flow_id",
  [authMiddleware.verifyBody, authMiddleware.uniqueEmail],
  async (req, res) => {
    const flow_id = req.params.flow_id;
    if (!isValidObjectId(flow_id)) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*Find student role*/
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow*/
    const flow = await Flow.findOne({ _id: flow_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow modules*/
    const modules = await Module.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow stages*/
    const stages = await Stage.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    }).sort({ step: "asc" });

    if (!flow) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*create userData*/
    const userData = new UserData({
      email: req.body.email,
      tutor_names: req.body.tutor_names,
      tutor_last_names: req.body.tutor_last_names,
      tutor_phone: req.body.tutor_phone,
      names: req.body.names,
      last_names: req.body.last_names,
      birthday: req.body.birthday,
      course: req.body.course,
      institution: req.body.institution,
      institution_commune: req.body.institution_commune,
      institution_region: req.body.institution_region,
      relation: req.body.relation
    });

    /*save userData in DB*/
    userData.save((err, userData) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Hash password*/
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    /*Create user*/
    const user = new User({
      email: req.body.email,
      names: req.body.names,
      password: hashPassword,
      role: role._id,
      flow: flow._id
    });

    /*Save user in DB*/
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }

      /*Generate user flow progress entry*/
      generateProgress(modules, stages, user, flow)
        .catch((err) => {
          return res.status(404).json({
            ok: false
          });
        })
        .then((progress) => {
          /*Send confirmation email*/
          sendConfirmationEmail(user, userData, res, req);

          return res.status(200).json({
            user
          });
        });
    });
  }
);

router.post(
  "/signup",
  [authMiddleware.verifyBody, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Fetch all flows
    const flows = await Flow.find({});
    if (!flows.length) {
      return res.status(404).json({
        ok: false,
        message: "FLOWS_NOT_FOUND_ERROR"
      });
    }
    // Fetch the latest user progress registered for this flow
    const lastUserFlow = await UserFlow.find({}).sort({ _id: -1 }).limit(1);
    // Set flow_id param
    let flow_id;
    if (lastUserFlow.length) {
      // Find last user flow's position in flows array
      let position = flows.findIndex((element) =>
        element._id.equals(lastUserFlow[0].flow)
      );
      // Position conditions
      if (position === flows.length - 1) {
        flow_id = flows[0]._id;
      } else {
        flow_id = flows[position + 1]._id;
      }
    } else {
      flow_id = flows[0]._id;
    }
    if (!isValidObjectId(flow_id)) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*Find student role*/
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow*/
    const flow = await Flow.findOne({ _id: flow_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow modules*/
    const modules = await Module.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow stages*/
    const stages = await Stage.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    }).sort({ step: "asc" });

    if (!flow) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*create userData*/
    const userData = new UserData({
      email: req.body.email,
      tutor_names: req.body.tutor_names,
      tutor_last_names: req.body.tutor_last_names,
      tutor_phone: req.body.tutor_phone,
      names: req.body.names,
      last_names: req.body.last_names,
      birthday: req.body.birthday,
      course: req.body.course,
      institution: req.body.institution,
      institution_commune: req.body.institution_commune,
      institution_region: req.body.institution_region,
      relation: req.body.relation
    });

    /*save userData in DB*/
    await userData.save((err, userData) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Hash password*/
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    /*Create user*/
    const user = new User({
      email: req.body.email,
      names: req.body.names,
      password: hashPassword,
      role: role._id,
      flow: flow._id
    });

    /*Save user in DB*/
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }

      /*Generate user flow progress entry*/
      generateProgress(modules, stages, user, flow)
        .catch((err) => {
          return res.status(404).json({
            ok: false
          });
        })
        .then((progress) => {
          /*Send confirmation email*/
          sendConfirmationEmail(user, userData, res, req);

          res.status(200).json({
            user
          });
        });
    });
  }
);

router.post(
  "/signupTestUser/:flow_id",
  [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail],
  async (req, res) => {
    const flow_id = req.params.flow_id;
    if (!isValidObjectId(flow_id)) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*Find student role*/
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow*/
    const flow = await Flow.findOne({ _id: flow_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow stages*/
    const stages = await Stage.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    }).sort({ step: "asc" });

    /*Find flow modules*/
    const modules = await Module.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    if (!flow) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*Hash password*/
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    /*Create user*/
    const user = new User({
      email: req.body.email,
      names: req.body.names,
      password: hashPassword,
      confirmed: true,
      role: role._id,
      flow: flow._id
    });

    /*Save user in DB*/
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }

      /*Generate user flow progress entry*/
      generateProgress(modules, stages, user, flow)
        .catch((err) => {
          return res.status(404).json({
            ok: false
          });
        })
        .then((progress) => {
          res.status(200).json({
            user
          });
        });
    });
  }
);

router.post("/login", async (req, res) => {
  //checking if username exists
  const user = await User.findOne(
    {
      email: req.body.email.toLowerCase()
    },
    (err) => {
      if (err) {
        return res.status(400).send(err);
      }
    }
  ).populate({ path: "role", model: Role });
  if (!user) return res.status(400).send("EMAIL_NOT_FOUND");
  //checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("INVALID_PASSWORD");
  //check if user is confirmed
  if (!user.confirmed) return res.status(400).send("USER_NOT_CONFIRMED");
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.header("x-access-token", token).send({ user: user, token: token });
});

router.post(
  "/registerMultiple/:flow_id",
  [authMiddleware.verifyBodyMultiple, authMiddleware.uniqueEmailMultiple],
  async (req, res) => {
    const flow_id = req.params.flow_id;

    if (!isValidObjectId(flow_id)) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    /*Find student role*/
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow*/
    const flow = await Flow.findOne({ _id: flow_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow modules*/
    const modules = await Module.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    });

    /*Find flow stages*/
    const stages = await Stage.find({ flow: flow }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }
    }).sort({ step: "asc" });

    if (!flow) {
      return res.status(404).json({
        ok: false,
        message: "FLOW_NOT_FOUND_ERROR"
      });
    }

    createDirIfNotExists("public/" + req.body.paramAdminId);
    const momento = Date.now();
    const fileName =
      "public/" +
      req.body.paramAdminId +
      "/" +
      flow.name +
      "_" +
      momento +
      ".csv";
    fs.appendFile(
      fileName,
      JSON.stringify("email" + "," + "password") + "\n",
      (err) => {
        if (err) {
          throw err;
        }
      }
    );

    for (
      let i = 0 + req.body.paramStart;
      i < req.body.paramUsers + req.body.paramStart;
      i++
    ) {
      let id = "";
      if (i < 10) {
        id += "00" + i;
      } else if (i >= 10 && i < 100) {
        id += "0" + i;
      } else {
        id += i;
      }

      let email = req.body.paramEmailPrefix + id + req.body.paramEmailSubfix;
      let password = Math.floor(1000 + Math.random() * 9000) + "";

      /*create userData*/
      const userData = new UserData({
        email: email,
        tutor_names: "NombreTutor",
        tutor_last_names: "ApellidoTutor",
        tutor_phone: null,
        names: req.body.paramName + id,
        last_names: ".",
        birthday: new Date(req.body.paramBirthdayYear).toUTCString(),
        course: req.body.paramCourse,
        institution: req.body.paramInstitution,
        institution_commune: req.body.paramCommune,
        institution_region: req.body.paramRegion,
        relation: "Tutor"
      });

      /*save userData in DB*/
      userData.save((err, userData) => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }
      });

      /*Hash password*/
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      /*Create user*/
      const user = new User({
        email: email,
        names: req.body.paramName,
        password: hashPassword,
        role: role._id,
        flow: flow._id
      });

      /*Save user in DB*/
      user.save((err, user) => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }

        /*Generate user flow progress entry*/
        generateProgress(modules, stages, user, flow)
          .catch((err) => {
            return res.status(404).json({
              ok: false
            });
          })
          .then((progress) => {
            /*Send confirmation email*/
            //            sendConfirmationEmail(user, userData, res, req);
          });

        fs.appendFile(
          fileName,
          JSON.stringify(user.email + "," + password) + "\n",
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      });
    }

    return res.status(200).json({
      message: "REGISTER_MULTIPLE_SUCCESS",
      nombre: flow.name + "_" + momento + ".csv"
    });
  }
);

function createDirIfNotExists(dir) {
  !fs.existsSync(dir) ? fs.mkdirSync(dir, { recursive: true }) : undefined;
}

router.get(
  "/getUserFiles/:user_id",
  [verifyToken, authMiddleware.isAdmin],
  async (req, res) => {
    const files = fs.readdirSync("public/" + req.params.user_id);

    return res.status(200).json({
      files: files
    });
  }
);

module.exports = router;
