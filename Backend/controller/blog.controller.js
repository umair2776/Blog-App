const Blog = require("../models/blog.model");
const cloudinary = require('cloudinary').v2;


exports.createBlog = async (req, res) => {
    try{
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.json({ status: 400, message: "Blog image is required" });
    }
    
    const { blogImage } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.json({ status: 400, message: "Invalid photo format, only jpg or png allowed" });
    }
  
    const { title,category,about } = req.body;
  
    if (!title || !category || !about) {
      return res.json({ status: 400, message: "Please fill all fields" });
    }
  const adminName=req?.user?.name;
  const adminPhoto=req?.user?.photo;
  const createdBy=req?.user?._id;


  
    const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }
  
    const blogData = ({
      title,about,category,adminName,adminPhoto,createdBy,blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      }
    });
  
    const blog = await Blog.create(blogData);

    return res.json({ status: 201, message: "Blog created successfully", blog });
}
   catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Internal server error", // Fixed the syntax
      error: err.message, // Optionally include the actual error message
    });
  
   }
}