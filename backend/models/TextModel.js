const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    text: String,
    title: String,
    userId: String,
  },
  { timestamps: true }
);

const TextModel = mongoose.model("text", textSchema);

module.exports = TextModel;
