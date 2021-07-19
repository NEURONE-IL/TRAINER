const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/registerAdmin",
  [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Role
    const role = await Role.findOne({ name: "admin" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
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
    });
    //save user in db
    await user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        user,
      });
    });
  }
);

router.post(
  "/register",
  [authMiddleware.verifyBody, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Role
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
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
    });
    //save user in db
    await user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        user,
      });
    });
  }
);

router.post("/login", async (req, res) => {
  //checking if username exists
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  }, err => {
    if(err){
      res.status(400).send(err)
    }
  }).populate( { path: 'role', model: Role} );
  if (!user) res.status(400).send("EMAIL_NOT_FOUND");
  //checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) res.status(400).send("INVALID_PASSWORD");
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("x-access-token", token).send({ user: user, token: token });
});



module.exports = router;