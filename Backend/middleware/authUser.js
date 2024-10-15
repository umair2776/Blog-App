const {User}=require("../models/user.model")
var jwt = require("jsonwebtoken");


//Authentication

exports.isAuthenticated=async(req,res,next)=>{
    try{ 
        const token = req.cookies.jwt;
console.log("Middleware :",token);

        if(!token){
            return res.json({status:401,message:"User Not authenticated"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=await User.findById(decoded.userId)
        if(!user){
            return res.json({status:404,err:"User not found"})
        }
        req.user=user;
        next();
    }
    catch(err){
        console.log("Error accuranig in authentication"+ err);
        return res.json({
            status:401,err:"USer not authentication"
        })

    }
}

