const express = require("express");
const { createBlog } = require("../controller/blog.controller");
const { isAuthenticated } = require("../middleware/authUser");
const router = express.Router();

// Register route
router.post("/blogs",isAuthenticated,createBlog)


// Export router
module.exports = router; 
