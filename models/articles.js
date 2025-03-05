const mongoose = require("mongoose");

const validator = require("validator");

const articles = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    default: "",
    validate: {
      validator: (v) => v === "" || validator.isURL(v),
      message: "The URL is not valid",
    },
  },
  url: {
    type: String,
    required: true,
    default: "",
    validate: {
      validator: (v) => v === "" || validator.isURL(v),
      message: "The URL is not valid",
    },
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  favorites: {
    type: [String],
    default: [],
    required: true,
  },
  likes: {
    type: [String],
    default: [],
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
    required: true,
  },
});

module.exports = mongoose.model("articles", articles);
