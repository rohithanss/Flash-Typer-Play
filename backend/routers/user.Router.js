const { Router } = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

const redis = require("../services/redis.js");
const tokenAuth = require("../middlewares/tokenAuth");

const UserModel = require("../models/UserModel");
const generateToken = require("../services/generateToken.js");
const authorise = require("../middlewares/authorise.js");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  let { name, email, password, role, otp } = req.body;
  if (
    name == undefined ||
    email == undefined ||
    password == undefined ||
    otp == undefined
  ) {
    res.send({ msg: "some fields are missing", status: "fail" });
    return;
  }
  let userExist = await UserModel.findOne({ email });

  try {
    let validOtp = await redis.get(email + "otp");

    if (validOtp != otp) {
      return res.send({ msg: "invalid otp", status: "fail" });
    }

    if (userExist?.email) {
      return res.send({ msg: "user already exists", status: "fail" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        console.log(err);
        res.send({
          msg: "error while signing up try again",
          status: "error",
        });
      } else {
        let user = new UserModel({
          name,
          email,
          password: hash,
          role: role == undefined ? "user" : role,
        });
        let savedUser = await user.save();
        let { token, refreshToken } = generateToken(
          res,
          savedUser._id,
          savedUser.role
        );
        res.send({
          msg: "sign up successful",
          status: "success",
          token,
          refreshToken,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: "error registering", status: "error" });
  }
});

userRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (email == undefined || password == undefined) {
    res.send({ msg: "some fields are missing", status: "fail" });
    return;
  }
  let userExist = await UserModel.find({ email });
  if (userExist.length == 0) {
    res.send({ msg: "wrong Credentials", status: "fail" });
  } else {
    let user = userExist[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.send({ msg: "Error while logging in", status: "error" });
      } else {
        if (result) {
          let { token, refreshToken } = generateToken(res, user._id, user.role);
          res.status(202).send({
            token,
            refreshToken,
            msg: "login Successful",
            status: "success",
          });
        } else {
          res.send({ msg: "wrong Credentials", status: "fail" });
        }
      }
    });
  }
});

userRouter.get("/profile", tokenAuth, async (req, res) => {
  let userId = req.body.userId;
  // res.send("asdf");
  try {
    let { name, _id, role } = await UserModel.findOne({ _id: userId });
    res.send({ name, userId: _id, role, status: "success" });
  } catch (err) {
    console.log(err);
    res.send({ msg: "something Went wrong! try again later", status: "error" });
  }
});

userRouter.post("/logout", tokenAuth, async (req, res) => {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  await redis.lpush("blacklist_tokens", token);
  res.send({ msg: "logged out successfully", status: "success" });
});

userRouter.post("/resetpassword", async (req, res) => {
  let { email, password, otp } = req.body;
  if (email == undefined || password == undefined || otp == undefined) {
    return res.send({ msg: "some fields are missing", status: "fail" });
  }
  let userExist = await UserModel.findOne({ email });
  if (!userExist?.email) {
    res.send({
      msg: "user does not exists",
      status: "fail",
    });
  } else {
    try {
      let validOtp = await redis.get(email + "otp");
      if (validOtp != otp) {
        return res.send({ msg: "invalid otp", status: "fail" });
      }
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          console.log(err);
          res.send({
            msg: "error while signing up try again",
            status: "error",
          });
        } else {
          let user = await UserModel.findOneAndUpdate(
            { email },
            {
              password: hash,
            }
          );

          let { token, refreshToken } = generateToken(
            res,
            userExist._id,
            userExist.role
          );
          res.send({
            msg: "sign up successful",
            status: "success",
            token,
            refreshToken,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.send({ msg: "error changing password", status: "error" });
    }
  }
});

userRouter.get("/topplayers", async (req, res) => {
  try {
    let topPlayers = await UserModel.aggregate()
      .sort({ speed: -1 })
      .limit(10)
      .project({ password: 0, _id: 0 });

    res.send({ players: topPlayers, status: "success" });
  } catch (err) {
    console.log(err);
    res.send({
      msg: "error while fetching the top users from db",
      status: "error",
    });
  }
});

userRouter.get(
  "/allplayers",
  tokenAuth,
  authorise(["admin"]),
  async (req, res) => {
    try {
      let users = await UserModel.find({ role: { $ne: "admin" } });
      res.send({ msg: "Users fetched Successfully", users, status: "success" });
    } catch (err) {
      res.send({ msg: "something went wrong", status: "error" });
    }
  }
);

userRouter.patch(
  "/edit/:userId",
  tokenAuth,
  authorise(["admin"]),
  async (req, res) => {
    try {
      let userId = req.params.userId;
      let { name, email } = req.body;

      let resp = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { name, email } }
      );
      res.send({ msg: "user updated successfully", status: "success" });
    } catch (err) {
      res.send({ msg: "something went wrong", status: "error" });
      console.log(err);
    }
  }
);

userRouter.delete(
  "/delete/:userId",
  tokenAuth,
  authorise(["admin"]),
  async (req, res) => {
    try {
      let userId = req.params.userId;

      let resp = await UserModel.findByIdAndDelete({ _id: userId });
      res.send({ msg: "user deleted successfully", status: "success" });
    } catch (err) {
      res.send({ msg: "something went wrong", status: "error" });
      console.log(err);
    }
  }
);
module.exports = userRouter;
