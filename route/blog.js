const express = require("express");
const router = express.Router();

const {
  createBlog,
  getBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  getBlogCategory,
  getUserBlog,
  getBlogByCategory,
} = require("../controllers/blog.controller");
const verifyJwt = require("../middleware/verifyJwt");

router.post("/create-blog", verifyJwt, createBlog);
router.get("/getAll", verifyJwt, getBlogs);
router.get("/get/:slug", getBlog);
router.delete("/delete/:id", verifyJwt, deleteBlog);
router.put("/update/:id", verifyJwt, updateBlog);
router.get("/getBlogFeed", getBlogs);
router.get("/getCategory", getBlogCategory);
router.get("/getUserBlogs", verifyJwt, getUserBlog);
router.post("/getBlogByCategory", getBlogByCategory);

module.exports = router;
