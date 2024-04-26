const Blog = require("../model/Blog");
const User = require("../model/User");
const Comment = require("../model/Comment");

const createComment = async (req, res) => {
  const { blogId, comment } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(400).json({ message: "Blog Not Found" });
    }
    const newComment = new Comment({
      userId,
      blogId,
      comment,
      name: user.name,
      profilePicture: user.profilePicture,
    });
    blog.commentCount = blog.commentCount + 1;
    await blog.save();
    await newComment.save();
    res.status(200).json({
      message: "Comment Created",
      comment: newComment,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

const getComments = async (req, res) => {
  const blogId = req.params.blogId;
  try {
    const comments = await Comment.find({ blogId });
    if (comments.length === 0) {
      return res
        .status(200)
        .json({ message: "All Comments", comments: [], success: true });
    }
    res.status(200).json({
      message: "All Comments",
      comments: comments,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment Not Found" });
    }
    const blog = await Blog.findById(comment.blogId);
    if (comment.userId !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Comment.findByIdAndDelete(commentId);
    blog.commentCount = blog.commentCount - 1;
    await blog.save();
    res.status(200).json({ message: "Comment Deleted", success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

const updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const { comment } = req.body;
  try {
    const iscommentExist = await Comment.findById(commentId);
    if (!iscommentExist) {
      return res.status(400).json({ message: "Comment Not Found" });
    }
    if (iscommentExist.userId !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    iscommentExist.comment = comment || iscommentExist.comment;
    await iscommentExist.save();
    res.status(200).json({ message: "Comment Updated", success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
  updateComment,
};
