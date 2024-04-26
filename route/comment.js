const express = require("express");
const router = express.Router();

const verifyJwt = require("../middleware/verifyJwt");

const {
  createComment,
  getComments,
  
  deleteComment,
  updateComment,
} = require("../controllers/comment.controller");


router.post("/comment", verifyJwt, createComment);
router.get("/getComments/:blogId", verifyJwt, getComments);
router.delete("/delete/:commentId", verifyJwt, deleteComment);
router.put("/update/:commentId", verifyJwt, updateComment);

module.exports = router;