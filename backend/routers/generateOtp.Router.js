const { Router } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const redis = require("../services/redis.js");

const generateOtpRouter = Router();

// CONFIGURING THE NODEMAILER TO SEND THE OTP

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    type: "OAuth2",
    user: "rhans6125@gmail.com",
    clientId: process.env.OTP_CLIENT_ID,
    clientSecret: process.env.OTP_CLIENT_SECRET,
    refreshToken: process.env.OTP_REFRESH_TOKEN,
  },
});

// ENDPOINT TO GENERATE THE OTP, AND SAVING THE OTP IN THE REDIS, AND SEND THE SAME OTP TO THE USER MAIL

generateOtpRouter.post("/", async (req, res) => {
  let { email } = req.body;
  if (email == undefined) {
    return res.send({ msg: "some fields are missing", status: "fail" });
  }
  try {
    let otp = Math.floor(Math.random() * (10000 - 1000)) + 1000; // GENERATING OTP
    redis.set(email + "otp", otp, "ex", 300); // SAVING OTP IN THE REDIS
    sendMail(email, otp); // SENDING OTP TO THE USER'S MAIL
    res.send({
      msg: "otp sent to mail, and is valid for 5 minutes",
      status: "success",
    });
  } catch (err) {
    res.send({ msg: "something went wrong, try again", status: "error" });
  }
});

// FUNCTION TO SEND MAIL,

async function sendMail(email, otp) {
  transporter.sendMail(
    {
      from: "rhans6125@gmail.com",
      to: email,
      subject: "OTP for Flash Typer Play",
      text: `OTP(One Time Password) is ${otp}.\nThis OTP is valid for 5 minutes only.`,
    },
    (err, info) => {
      if (err) {
        return err;
      } else {
        return info;
      }
    }
  );
}

module.exports = generateOtpRouter;
