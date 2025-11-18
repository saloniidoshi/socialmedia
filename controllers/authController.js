const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

exports.register = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;
    // Check existing email
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: {},
        message: "Email already registered.",
        error: {},
      });
    }

    // Check existing username
    const existingUserName = await User.findOne({ name, isDeleted: false });
    if (existingUserName) {
      return res.status(409).json({
        status: 409,
        data: {},
        message: "Name is not available.",
        error: {},
      });
    }

    // Hash password and create user
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, password: hashed, number });

    // Generate token and save
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    user.accessToken = token;
    await user.save();

    // Success response
    return res.status(201).json({
      status: 201,
      data: user.toJSON(),
      message: "User registered successfully.",
      error: {},
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check existing email
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (!existingUser) {
      return res.status(409).json({
        status: 409,
        data: {},
        message: "User not found.",
        error: {},
      });
    }
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(409).json({
        status: 409,
        data: {},
        message: "Invalid Credentials.",
        error: {},
      });
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    existingUser.accessToken = token;
    await existingUser.save();
    return res.status(200).json({
      status: 200,
      data: existingUser,
      message: "User login successfully.",
      error: {},
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error during login.",
      error: error.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found",
        error: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: user,
        message: "User fetch successfully",
        error: {},
      });
    }
  } catch (err) {
    console.error("Me error", err);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error.",
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "User not found",
        error: "",
      });
    }
    user.accessToken = null;
    await user.save();
    return res.status(200).json({
      status: 200,
      data: {},
      message: "User logout successsfully",
      error: "",
    });
  } catch (error) {
    console.error("logout account error", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error during logout.",
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.isDeleted = true;
    user.accessToken = null;
    await user.save();
    return res.status(200).json({
      status: 200,
      data: {},
      message: "Account deleted successfully",
      error: "",
    });
  } catch (err) {
    console.error("Delete account error", err);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error during account deleting.",
      error: err.message,
    });
  }
};
