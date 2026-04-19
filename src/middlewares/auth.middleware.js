import { ApiError } from "../utils/apierr.js";
import { asynchandeler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const verifyJWT = asynchandeler(async(req,res,next)=>{
 try {
   const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer " ,"" )
   if(!token){
      throw new ApiError(401, "unuthorised request ")
   }
  
    const decodeToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )
     const user =  await User.findById(decodeToken?._id).select("-password -refreshToken")
     // to discuss todoes 
     if(!user){
          throw new ApiError(401 , "invalid access token  ")
     }
    req.user = user;
    next()
 } catch (error) {
    throw new ApiError(401 , error?.message || "invalid access token ")
 }
  
})