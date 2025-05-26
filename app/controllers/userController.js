// controllers/userController.js
const User = require("../models/User");

// GET All Users
exports.getAllUsers = async (req, res) => {
  try {
    // Build filter using multiple Mongo operators
    const filter = {};

    // Regex on name (firstName or lastName)
    if (req.query.name) {
      filter.$or = [
        { firstName: { $regex: req.query.name, $options: "i" } },
        { lastName: { $regex: req.query.name, $options: "i" } },
      ];
    }

    // Numeric range on age (gte / lte)
    if (req.query.minAge || req.query.maxAge) {
      filter.age = {};
      if (req.query.minAge) filter.age.$gte = Number(req.query.minAge);
      if (req.query.maxAge) filter.age.$lte = Number(req.query.maxAge);
    }

    // Greater than / less than on age (gt / lt)
    if (req.query.ageGt || req.query.ageLt) {
      filter.age = filter.age || {};
      if (req.query.ageGt) filter.age.$gt = Number(req.query.ageGt);
      if (req.query.ageLt) filter.age.$lt = Number(req.query.ageLt);
    }

    // Not equal on email ($ne)
    if (req.query.excludeEmail) {
      filter.email = { $ne: req.query.excludeEmail };
    }

    // 5) In on email ($in)
    if (req.query.emailIn) {
      filter.email = {
        ...(filter.email || {}),
        $in: req.query.emailIn.split(","),
      };
    }

    // Not In on email ($nin)
    if (req.query.emailNin) {
      filter.email = {
        ...(filter.email || {}),
        $nin: req.query.emailNin.split(","),
      };
    }

    // Field selection
    const select = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    // Pagination defaults
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select(select)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ results: users.length, page, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

// GET User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

// CREATE User
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: error.message });
  }
};

// UPDATE User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: error.message });
  }
};

// DELETE User by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};
