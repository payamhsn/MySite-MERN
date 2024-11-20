import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import path from "path";
import fs from "fs";

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// @desc    Get user's blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
const getUserBlogs = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const blogs = await Blog.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(blogs);
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  console.log(req);
  // test e omadane file
  const user = await User.findById(req.user._id);

  // Handle image uploads

  const images = req.files ? req.files.map((file) => file.path) : [];

  const blog = await Blog.create({
    user: req.user._id,
    title,
    content,
    images,
    author: user.name,
  });
  // console.log(user);
  // console.log(images);
  // console.log(blog);

  res.status(201).json(blog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check blog ownership
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Handle image uploads for update
  const images = req.files ? req.files.map((file) => file.path) : blog.images;

  // Remove old images if new images are uploaded
  if (req.files && blog.images.length > 0) {
    blog.images.forEach((imagePath) => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  blog.images = images;

  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check blog ownership
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Remove associated images
  if (blog.images && blog.images.length > 0) {
    blog.images.forEach((imagePath) => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  await Blog.deleteOne({ _id: req.params.id });
  res.json({ message: "Blog removed" });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.json(blog);
});

export {
  getBlogs,
  getUserBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
};
