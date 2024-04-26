const express = require("express");
const router = express.Router();



const {createBlog, getBlogs, getBlog, deleteBlog, updateBlog} = require("../controllers/blog.controller");
const  verifyJwt  = require("../middleware/verifyJwt");

router.post("/create-blog",verifyJwt, createBlog);
router.get("/getAll",verifyJwt, getBlogs);
router.get("/get/:slug",verifyJwt, getBlog);
router.delete("/delete/:id",verifyJwt, deleteBlog);
router.put("/update/:id",verifyJwt, updateBlog);
module.exports = router;