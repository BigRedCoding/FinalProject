const mongoose = require("mongoose");

const validator = require("validator");

const articles = new mongoose.Schema({
  author: {
    type: String,
    required: false,
    default: "",
  },
  title: {
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  imageUrl: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: (v) => v === "" || validator.isURL(v),
      message: "The URL is not valid",
    },
  },
  url: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: (v) => v === "" || validator.isURL(v),
      message: "The URL is not valid",
    },
  },
  source: {
    type: String,
    required: false,
    default: "",
  },
  date: {
    type: String,
    required: false,
    default: "",
  },
  favorites: {
    type: [String],
    default: [],
    required: false,
  },
  likes: {
    type: [String],
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("articles", articles);
