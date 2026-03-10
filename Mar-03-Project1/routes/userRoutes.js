const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users (query by username with includes/partial match)
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };
    if (req.query.username) {
      filter.username = { $regex: req.query.username, $options: "i" };
    }
    const users = await User.find(filter).populate("role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Soft delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /enable - enable user by email + username
router.post("/enable", async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email and username are required" });
    }
    const user = await User.findOne({
      email,
      username,
      isDeleted: false,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = true;
    await user.save();
    res.json({ message: "User enabled successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /disable - disable user by email + username
router.post("/disable", async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email and username are required" });
    }
    const user = await User.findOne({
      email,
      username,
      isDeleted: false,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = false;
    await user.save();
    res.json({ message: "User disabled successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
