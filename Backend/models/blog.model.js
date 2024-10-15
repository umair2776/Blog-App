const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
title: { type: String, required: true },
  blogImage:{public_id:{type:String,required:true},url:{type:String,required:true}},
  category: { type: String, required: true },
  about: { type: String, required: true, minlength: 10},
  adminName:{type:String},
  adminPhoto:{type:String},
  createdBy:{
  type:mongoose.Schema.ObjectId,
  ref:"User"
  }
});

// Use module.exports to export the model
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
