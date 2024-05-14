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
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
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
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const user = await User.findById(comment.userId);
      comment.profilePicture = user.profilePicture;
      await comment.save();
    }
    res.status(200).json({
      message: "All Comments",
      comments: comments,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
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
    console.log(comment.userId.toString(), req.userId);
    if (comment.userId.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Comment.findByIdAndDelete(commentId);
    blog.commentCount = blog.commentCount - 1;
    await blog.save();
    res.status(200).json({ message: "Comment Deleted", success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
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
    if (iscommentExist.userId.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    iscommentExist.comment = comment || iscommentExist.comment;
    await iscommentExist.save();
    res.status(200).json({ message: "Comment Updated", success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// const setAuthorProfile = async (req, res) => {
//   const comments = await Comment.find();
//   for (let i = 0; i < comments.length; i++) {
//     const blog = comments[i];
//     const user = await User.findById(blog.userId);
//     blog.profilePicture = user.profilePicture;
//     await blog.save();
//   }
//   res.status(200).json({ message: "Author Profile Updated", success: true });
// };

module.exports = {
  createComment,
  getComments,
  deleteComment,
  updateComment,
  // setAuthorProfile,
};
