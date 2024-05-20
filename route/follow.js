const express = require("express");
const router = express.Router();

const verifyJwt = require("../middleware/verifyJwt");

const {
  follow,
  unFollow,
  getFollowers,
  getFollowing,
} = require("../controllers/follow.controller");

router.post("/follow", verifyJwt, follow);
router.post("/unfollow", verifyJwt, unFollow);
router.get("/followers", verifyJwt, getFollowers);
router.get("/following", verifyJwt, getFollowing);

module.exports = router;
