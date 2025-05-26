// controllers/postController.js
const Post = require("../models/Post");

// GET All Posts
exports.getAllPosts = async (req, res) => {
  try {
    // Build filter
    const filter = {};

    //Regex on title
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    // 2) Date range gte / lte
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate)
        filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate)
        filter.createdAt.$lte = new Date(req.query.endDate);
    }

    // gt / lt
    if (req.query.viewsGt || req.query.viewsLt) {
      filter.views = {};
      if (req.query.viewsGt) filter.views.$gt = Number(req.query.viewsGt);
      if (req.query.viewsLt) filter.views.$lt = Number(req.query.viewsLt);
    }

    // $ne
    if (req.query.excludeUser) {
      filter.userId = { ...(filter.userId || {}), $ne: req.query.excludeUser };
    }

    // $in
    if (req.query.userIds) {
      filter.userId = {
        ...(filter.userId || {}),
        $in: req.query.userIds.split(","),
      };
    }

    // $nin
    if (req.query.excludeUserIds) {
      filter.userId = {
        ...(filter.userId || {}),
        $nin: req.query.excludeUserIds.split(","),
      };
    }

    // Field selection
    const select = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    // Sorting
    const sortBy = req.query.sort || "-createdAt";

    // Pagination defaults
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .populate("userId", "firstName lastName")
      .select(select)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ results: posts.length, page, data: posts });
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
