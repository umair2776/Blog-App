const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, validate: [validator.isEmail, "Please enter a valid email"] },
  phone: { type: Number, required: true },
  photo:{public_id:{type:String,required:true},url:{type:String,required:true}},
  education: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "admin"] },
  password: { type: String, required: true, select: false, minlength: 8 },
  token:{type:String},
  createdAt: { type: Date, default: Date.now }
});

// Use module.exports to export the model
const User = mongoose.model("Users", userSchema);
module.exports = User;
