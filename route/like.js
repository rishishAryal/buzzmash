const express = require("express");
const router = express.Router();

const verifyJwt = require("../middleware/verifyJwt");

const { likeBlog } = require("../controllers/like.controller");


router.post("/like", verifyJwt, likeBlog);


module.exports = router;