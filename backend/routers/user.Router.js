const { Router } = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

const redis = require("../services/redis.js");
const tokenAuth = require("../middlewares/tokenAuth");

const UserModel = require("../models/UserModel");
const generateToken = require("../services/generateToken.js");
const authorise = require("../middlewares/authorise.js");

// THIS ENDPOINT HAS ALL THE USERS RELATED ENDPOINTS FOR BOTH USER/PLAYER AND ADMIN

const userRouter = Router();

// ENDPOINT FOR CREATING NEW USER/PLAYER ACCOUNT

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
    let validOtp = await redis.get(email + "otp"); // VALIDATING OTP

    if (validOtp != otp) {
      return res.send({ msg: "invalid otp", status: "fail" });
    }

    if (userExist?.email) {
      return res.send({ msg: "user already exists", status: "fail" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
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

        let savedUser = await user.save(); // SAVING USER IN THE DB

        let { token, refreshToken } = generateToken(
          // GENERATING TOKEN AND REFRESH TOKEN, SO THE USER DON'T HAVE TO LOGIN AFTER SIGNING UP
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
    res.send({ msg: "error registering", status: "error" });
  }
});

// ENDPOINT FOR THE LOGGING IN FOR THE USER/PLAYER AND ADMIN

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

// ENDPOINT TO GET USERS DETAIL, NAME , AND ROLE TO SHOW ON THE FRONTEND

userRouter.get("/profile", tokenAuth, async (req, res) => {
  let userId = req.body.userId;

  try {
    let { name, _id, role } = await UserModel.findOne({ _id: userId });
    res.send({ name, userId: _id, role, status: "success" });
  } catch (err) {
    res.send({ msg: "something Went wrong! try again later", status: "error" });
  }
});

// ENDPOINT TO LOGOUT USER

userRouter.post("/logout", tokenAuth, async (req, res) => {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  await redis.lpush("blacklist_tokens", token); // ADDING THE TOKEN IN THE BLACKLIST, SO THAT THE SAME TOKEN CANNOT BE USED AGAIN AFTER LOGGING IN
  res.send({ msg: "logged out successfully", status: "success" });
});

// ENDPOINT FOR THE FORGET PASSWORD

userRouter.post("/resetpassword", async (req, res) => {
  let { email, password, otp } = req.body;

  if (email == undefined || password == undefined || otp == undefined) {
    return res.send({ msg: "some fields are missing", status: "fail" });
  }

  let userExist = await UserModel.findOne({ email }); // VALIDATING WHETHER THE USER HAS AN ACCOUNT OR NOT

  if (!userExist?.email) {
    res.send({
      msg: "user does not exists",
      status: "fail",
    });
  } else {
    try {
      let validOtp = await redis.get(email + "otp"); // VALIDATING THE OTP

      if (validOtp != otp) {
        return res.send({ msg: "invalid otp", status: "fail" });
      }
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send({
            msg: "error while signing up try again",
            status: "error",
          });
        } else {
          // UPDATING NEW PASSWORD IN THE DB

          let user = await UserModel.findOneAndUpdate(
            { email },
            {
              password: hash,
            }
          );

          // GENERATING TOKEN AND REFRESH TOKEN, SO THE USER DON'T HAVE TO LOGIN AFTER CHANGING PASSWORD

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
      res.send({ msg: "error changing password", status: "error" });
    }
  }
});

// ENDPOINT TO GET TOP TEN PLAYERS TYPING SPEED AND NAME TO DISPLAY NAMES ON THE LEADER BOARD.

userRouter.get("/topplayers", async (req, res) => {
  try {
    let topPlayers = await UserModel.aggregate()
      .sort({ speed: -1 })
      .limit(10)
      .project({ password: 0, _id: 0 });

    res.send({ players: topPlayers, status: "success" });
  } catch (err) {
    res.send({
      msg: "error while fetching the top users from db",
      status: "error",
    });
  }
});

// ENDPOINT TO GET ALL PLAYERS/USERS, ONLY ADMIN HAS ACCESS

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

// ENDPOINT TO UPDATE PLAYERS/USERS' NAME OR EMAIL, ONLY ADMIN HAS ACCESS

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
    }
  }
);

// ENDPOINT TO DELETE PLAYERS/USERS, ONLY ADMIN HAS ACCESS

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
    }
  }
);
module.exports = userRouter;
