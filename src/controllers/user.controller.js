import { asynchandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/apierr.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apires.js";

const registerUser = asynchandeler(async(req,res)=>{
    // get user details from frontend
    // validation 
    // check if user already exist or not : email , password 
    // check for images and check for avtar 
    // upload the to the cloudnary , avtar
    // create user object - create entry in db
    // remove password and refresh token filed for response 
    // check user creation 
    // return res 


//    const {email, fullname , password } = req.body
//    console.log("email: " ,email, "fullname :",fullname);



   if([username , useremail ].some((filed)=> filed?.trim==="")
   ){
      throw new ApiError(400,"allfields are required")
    }
     const exituser = User.findOne({
        $or:[{uername},{useremail},{password}]
    })
    if(exituser){
        throw new ApiError(409 ,"the alredy user with name and email , exist")
    }
  // avtar and cover image path check and 
    const avtarLocalpath =  req.files?.avtar[0]?.path 
    const coverimageLocalpath= req.files?.coverimage[0]?.path
    
    if(!avtarLocalpath){
        throw new ApiError(400 , "avtar are required in the filed ")
    } 

      const avatar = await uploadOnCloudinary(avtarLocalpath);
      const coverimage = await uploadOnCloudinary(coverimageLocalpath)

      if(!avatar){
        throw new ApiError(400 , "avtar are required in the filed ")
      }
  

     const user =  await User.create({
         fullname ,
         avtar:avatar.url,
         coverimage:coverimage?.url ||"",
         email,
         password,
         username:username.toLowercase()

      })

      const createdUser =  User.findById(user._id).select(
        "-password -refreshToken"
      )
      if(!createdUser){
            throw new ApiError(500 ,"something was wrong  if user register" )
      }
    
   return res.status(201).json(new ApiResponse (200 , createdUser," user register sucessfully"))
   
})
export{registerUser}