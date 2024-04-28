const Blog = require("../model/Blog");
const Like = require("../model/Like");

const likeBlog = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(400).json({ message: "Blog Not Found" });
    }
    const isAlreadyLiked = await Like.findOne({ userId, blogId });
    if (isAlreadyLiked) {
      await Like.findOneAndDelete({ userId, blogId });
      blog.likeCount = blog.likeCount - 1;
      await blog.save();
      return res.status(200).json({ message: "Blog Unliked", success: true });
    }
    const like = new Like({ userId, blogId });
    blog.likeCount = blog.likeCount + 1;
    await blog.save();
    await like.save();
    res.status(200).json({ message: "Blog Liked", success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  likeBlog,
};
