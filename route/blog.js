const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage(); // Use memory storage for files
const upload = multer({ storage: storage });
const {
  createBlog,
  getBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  getBlogCategory,
  getUserBlog,
  getBlogByCategory,
  addBlogThumbnail,
  getFeedOfFollowedUser,
  // setAuthorProfile,
} = require("../controllers/blog.controller");
const verifyJwt = require("../middleware/verifyJwt");

router.post("/create-blog", verifyJwt, createBlog);
router.get("/getAll", getBlogs);
router.get("/get/:slug", getBlog);
router.delete("/delete/:id", verifyJwt, deleteBlog);
router.put("/update/:id", verifyJwt, updateBlog);
router.get("/getBlogFeed", getBlogs);
router.get("/getCategory", getBlogCategory);
router.get("/getUserBlogs", verifyJwt, getUserBlog);
router.post("/getBlogByCategory", getBlogByCategory);
// router.get("/setAuthorProfile", setAuthorProfile);

router.post(
  "/addBlogThumbnail/:blogId",
  verifyJwt,
  addBlogThumbnail
);
router.get("/getFeedOfFollowedUser", verifyJwt, getFeedOfFollowedUser);

module.exports = router;
