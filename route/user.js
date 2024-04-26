const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserProfile,
  logout,
  changePassword,
} = require("../controllers/user.controllers");
const verifyJwt = require("../middleware/verifyJwt");

router.post("/register", register);
router.post("/login", login);
router.post("/profile", verifyJwt, getUserProfile);
router.post("/logout", verifyJwt, logout);
router.put("/changePassword", verifyJwt, changePassword);

module.exports = router;

