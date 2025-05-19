// controllers/postController.js
const Post = require("../models/Post");

// GET All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "firstName lastName");
    res.status(200).json({ data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: error.message });
  }
};

// GET Post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "userId",
      "firstName lastName"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ data: post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch post", error: error.message });
  }
};

// CREATE Post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create post", error: error.message });
  }
};

// UPDATE Post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post updated successfully", data: updatedPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update post", error: error.message });
  }
};

// DELETE Post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: error.message });
  }
};
