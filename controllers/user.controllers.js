const User = require("../model/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { trusted } = require("mongoose");

// Register a new user
const register = async (req, res) => {
  const { name, username, email, password, DOB } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      DOB,
    });
    await newUser.save();
    const jwtToken = jwt.sign(
      { userId: newUser._id },
      "kPGzq3kH48aDGD9N23Fs5T8jYqHb5GXs",
      { expiresIn: "1h" }
    );
    res.status(201).json({
      message: "User Registered",
      jwtToken,
      user: newUser,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const checkIfUsernameAvailable = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "Username Already Exists", isAvailable: false });
    }
    res.status(200).json({ message: "Username Available", isAvailable: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const checkIfEmailAvailable = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email Already Exists", isAvailable: false });
    }
    res.status(200).json({ message: "Email Available", isAvailable: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Exist" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const jwtToken = jwt.sign(
      { userId: user._id },
      "kPGzq3kH48aDGD9N23Fs5T8jYqHb5GXs",
      { expiresIn: "1h" }
    );
    res
      .status(201)
      .json({ message: "User Login", jwtToken, user: user, success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ message: "User Profile Fetched", profile: user });
  } catch (err) {
    res.json(err);
  }
};
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({ message: "User Logged Out", profile: decoded });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password Changed" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
module.exports = {
  register,
  login,
  getUserProfile,
  logout,
  changePassword,
  checkIfUsernameAvailable,
  checkIfEmailAvailable,
};
