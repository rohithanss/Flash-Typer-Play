const { Router } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const redis = require("../services/redis.js");

const generateOtpRouter = Router();
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

generateOtpRouter.post("/", async (req, res) => {
  let { email } = req.body;
  if (email == undefined) {
    return res.send({ msg: "some fields are missing", status: "fail" });
  }
  try {
    let otp = Math.floor(Math.random() * (10000 - 1000)) + 1000;
    redis.set(email + "otp", otp, "ex", 300);
    sendMail(email, otp);
    res.send({
      msg: "otp sent to mail, and is valid for 5 minutes",
      status: "success",
    });
  } catch (err) {
    res.send({ msg: "something went wrong, try again", status: "error" });
  }
});

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
        console.log(err);
      } else {
        console.log(info);
      }
    }
  );
}

module.exports = generateOtpRouter;
