const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage(); // Use memory storage for files
const upload = multer({ storage: storage });
const {
  register,
  login,
  getUserProfile,
  logout,
  changePassword,
  checkIfUsernameAvailable,
  checkIfEmailAvailable,
  updateUserDetails,
  checkifLogin,
  uploadProfilePicture,
  searchUser,
} = require("../controllers/user.controllers");
const verifyJwt = require("../middleware/verifyJwt");

router.post("/register", register);
router.post("/login", login);
router.post("/profile", verifyJwt, getUserProfile);
router.post("/logout", verifyJwt, logout);
router.put("/changePassword", verifyJwt, changePassword);
router.post("/checkUsername", checkIfUsernameAvailable);
router.post("/checkEmail", checkIfEmailAvailable);
router.put("/updateProfile", verifyJwt, updateUserDetails);
router.get("/refresh-token", checkifLogin);
router.post(
  "/profilePicture",
  upload.single("profilePicture"),
  verifyJwt,
  uploadProfilePicture
);
router.post("/search", verifyJwt, searchUser);

module.exports = router;
