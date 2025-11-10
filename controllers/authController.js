const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

exports.register = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    // Validate required fields
    if (!name || !email || !password || !number) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Name, email, number, and password are required.",
        error: {},
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: {},
        message: "Email already registered.",
        error: {},
      });
    }

    // Check existing username
    const existingUserName = await User.findOne({ name });
    if (existingUserName) {
      return res.status(409).json({
        status: 409,
        data: {},
        message: "Name is not available.",
        error: {},
      });
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: 400,
        data: {},
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
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
    return res.status(500).json({
      status: 500,
      data: {},
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

