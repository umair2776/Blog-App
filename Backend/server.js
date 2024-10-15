const express=require("express")
const app=express();
const dotenv=require("dotenv")
const mongoos=require("mongoose")
const userRoute = require("./route/user.route")
const blogRoute = require("./route/blog.route")
const cookieParsor=require("cookie-parser")

const fileUpload=require("express-fileupload")
const cloudinary = require('cloudinary').v2;
dotenv.config();
const PORT = process.env.PORT || 1000;
const MONGO_URI=process.env.MONGO_URI;

try{
mongoos.connect(MONGO_URI);
console.log("MongoDb is connectd Successfully");

}
catch(err){
    console.log(err);
    
}
app.use(express.json());
app.use(cookieParsor());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp"

}))

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

app.use("/api/users",userRoute)
app.use("/api/blogs",blogRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})