const User = require("../models/user.model");
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

// Register function
exports.register = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.json({ status: 400, message: "User Photo is required" });
  }
  
  const { photo } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
  
  if (!allowedFormats.includes(photo.mimetype)) {
    return res.json({ status: 400, message: "Invalid photo format, only jpg or png allowed" });
  }

  const { email, name, phone, role, education, password } = req.body;

  if (!email || !education || !name || !phone || !role || !password || !photo) {
    return res.json({ status: 400, message: "Please fill all fields" });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.json({ status: 400, message: "User already exists with this email" });
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(cloudinaryResponse.error);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email, phone, password: hashPassword, role, education, name, photo: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.url,
    }
  });

  await newUser.save();

  if (newUser) {
    var token = jwt.sign({ id: newUser._id }, 'Abc 12345');
    return res.json({ status: 201, message: "User created successfully", newUser, token });
  }
};

// Login function

// Login function
exports.login = async (req, res) => {
  const { email, password, role } = req.body; // Role ko destructure kiya

  // Input validation
  if (!email || !password || !role) { 
      return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
      // Find the user by email and include the password
      const user = await User.findOne({ email }).select("+password");
      console.log("User found:", user); // Log the found user

      // User validation
      if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);

      // Password match validation
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Role validation
      if (user.role !== role) {
          return res.status(400).json({ status: 400, message: `Given role ${role} not found` });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, 'Abc 12345');
   console.log("login",token);
      // Send success response
      return res.status(200).json({
          message: "User logged in successfully",
          user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role // Role ko front-end ke liye bhejna
          },
          token
      });
  } catch (error) {
      console.error("Login error:", error); // Log any errors
      return res.status(500).json({ message: "Server error" });
  }
};
// Logout function
exports.logout = (req, res) => {
 
  return res.status(200).json({ message: "User logged out successfully" });
};
