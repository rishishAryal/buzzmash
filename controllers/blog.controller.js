const Blog = require("../model/Blog");
const User = require("../model/User");
const Category = require("../model/Category");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");

const createBlog = async (req, res) => {
  const { title, description, category } = req.body;
  const id = req.userId;
  console.log(id);
  const user = await User.findById(id);

  const isCategoryExist = await Category.findOne({ name: category });

  if (isCategoryExist === null) {
    await Category.create({ name: category });
  }
  const slug = title.replace(/\s/g, "-").toLowerCase();
  const author = user.name;
  const newBlog = new Blog({
    title: title,
    description: description,
    slug: slug,
    category: category,
    author: author,
    userId: id,
  });
  await newBlog.save();
  res.status(200).json({
    message: "Blog created successfully",
    blog: newBlog,
    success: true,
  });
  try {
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ message: "All Blogs", blogs: blogs, success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
const getBlog = async (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  try {
    const blog = await Blog.findOne({ slug: slug });
    res
      .status(200)
      .json({ message: "Blog fetched", blog: blog, success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const blog = await Blog.findById(id);
    if (blog) {
      if (blog.userId.toString() !== req.userId) {
        return res
          .status(401)
          .json({ message: "You are not authorized", success: false });
      }
      const deletBlog = await Blog.findByIdAndDelete(id);
    } else {
      return res
        .status(404)
        .json({ message: "Blog Not Found", success: false });
    }

    res.status(200).json({ message: "Blog Deleted", success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const updateBlog = async (req, res) => {
  const { author, title, description, category, thumbnail } = req.body;
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);
    if (category) {
      const isCategoryExist = await Category.findOne({ name: category });

      if (isCategoryExist === null) {
        await Category.create({ name: category });
      }
    }

    if (blog) {
      if (blog.userId.toString() !== req.userId) {
        return res
          .status(401)
          .json({ message: "You are not authorized", success: false });
      }
      const data = {
        author: author || blog.author,
        title: title || blog.title,
        description: description || blog.description,
        category: category || blog.category,
        thumbnail: thumbnail || blog.thumbnail,
        updatedAt: Date.now(),
      };
      const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
      res
        .status(200)
        .json({ message: "Blog Updated", success: true, updatedBlog });
    } else {
      return res
        .status(404)
        .json({ message: "Blog Not Found", success: false });
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
const getBlogCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "All Categories",
      categories: categories,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getUserBlog = async (req, res) => {
  const id = req.userId;
  try {
    const blogs = await Blog.find({ userId: id });
    res.status(200).json({ message: "All Blogs", blogs: blogs, success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getBlogByCategory = async (req, res) => {
  const { category } = req.body;

  try {
    const blogs = await Blog.find({ category: category });
    const count = blogs.length;
    res.status(200).json({
      message: "All Blogs",
      blogs: blogs,
      count: count,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const addBlogThumbnail = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  console.log("upload");
 
  const {blogId}  = req.body
  // Create a readable stream from the buffer
  const readableInstanceStream = new stream.Readable({
    read() {
      this.push(req.file.buffer);
      this.push(null); // Signal the end of the stream
    }
  });

  try {
    // Upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blog", resource_type: "image" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Internal Server Error", error: error.message, success: false});
        }
        const blog = await Blog.findById(blogId);
        if (!blog) {
          return res.status(404).json({ message: "Blog not found", success: false});
        }
        blog.thumbnail = result.secure_url;
        await blog.save();

        // Assuming `User` is your User model and you have a way to get `userId`
        

        res.json({ message: "blog thumbnail updated", success: true, thumbnail: result.secure_url});
      }
    );

    // Pipe the readable stream to Cloudinary
    readableInstanceStream.pipe(uploadStream);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message, success: false});
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  getBlogCategory,
  getUserBlog,
  getBlogByCategory,
  addBlogThumbnail
};
