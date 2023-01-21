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

textRouter.get("/all", tokenAuth, authorise(["admin"]), async (req, res) => {
  try {
    let text = await TextModel.find();

    return res.send({ data: text, status: "success" });
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
    let newText = await doc.save();
    return res.send({
      msg: "Text added successfully",
      newText,
      status: "success",
    });
  } catch (err) {
    res.send({
      msg: "Something went wrong while fetching text",
      status: "error",
    });
  }
});

textRouter.patch(
  "/edit/:textId",
  tokenAuth,
  authorise(["admin"]),
  async (req, res) => {
    let { title, text, userId } = req.body;
    let textId = req.params.textId;
    if (title == undefined || text == undefined || userId == undefined) {
      return res.send({ msg: "some fields are missing", status: "fail" });
    }
    try {
      let doc = await TextModel.findOneAndUpdate(
        { _id: textId },
        { title, text }
      );
      if (doc) {
        return res.send({
          msg: "Text updated successfully",
          status: "success",
        });
      } else {
        res.send({
          msg: "Something went wrong while updating text",
          status: "error",
        });
      }
    } catch (err) {
      res.send({
        msg: "Something went wrong while updating text",
        status: "error",
      });
    }
  }
);

textRouter.delete(
  "/delete/:textId",
  tokenAuth,
  authorise(["admin"]),
  async (req, res) => {
    let textId = req.params.textId;

    try {
      let doc = await TextModel.findOneAndDelete({ _id: textId });
      if (doc) {
        return res.send({
          msg: "Text deleted successfully",
          status: "success",
        });
      } else {
        res.send({
          msg: "Something went wrong while deleting text",
          status: "error",
        });
      }
    } catch (err) {
      res.send({
        msg: "Something went wrong while deleting text",
        status: "error",
      });
    }
  }
);
module.exports = textRouter;
