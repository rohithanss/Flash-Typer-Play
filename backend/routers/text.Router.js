const { Router } = require("express");

const TextModel = require("../models/TextModel.js");
const tokenAuth = require("../middlewares/tokenAuth");
const authorise = require("../middlewares/authorise");

const textRouter = Router();

textRouter.get("/", async (req, res) => {
  try {
    let text = await TextModel.aggregate().sample(1);

    return res.send({ text: text[0], status: "success" });
  } catch (err) {
    res.send({
      msg: "Something went wrong while fetching text",
      status: "error",
    });
  }
});

textRouter.post("/add", tokenAuth, authorise(["admin"]), async (req, res) => {
  let { title, text, userId } = req.body;
  if (title == undefined || text == undefined || userId == undefined) {
    return res.send({ msg: "some fields are missing", status: "fail" });
  }
  try {
    let doc = await TextModel({ title, text });
    await doc.save();
    return res.send({ msg: "Text added successfully", status: "success" });
  } catch (err) {
    res.send({
      msg: "Something went wrong while fetching text",
      status: "error",
    });
  }
});

module.exports = textRouter;
