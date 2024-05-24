const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
    default: "",
  },
  twitter: {
    type: String,
    trim: true,
    default: "",
  },
  facebook: {
    type: String,
    trim: true,
    default: "",
  },

  DOB: {
    type: String,
    require: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
});

module.exports = User = mongoose.model("Users", userSchema);
