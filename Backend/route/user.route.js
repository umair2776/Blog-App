const express = require("express");
const { register, login,logout } = require("../controller/user.controller");  // Ensure this line is correct
const { isAuthenticated } = require("../middleware/authUser");

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);
router.get("/logout",isAuthenticated,logout);


// Export router
module.exports = router;
