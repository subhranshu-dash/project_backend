import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_APIKYE,
  api_secret: process.env.CLOUDNARY_APISECRET,
});

const cloudinaryfileupload = async (localpath)=>{
    try{

     if(!localpath) return null
     //upload the file cloudnary
     const response = cloudinary.uploader.upload( localpath,{
        resource_type :"auto"
     })
     //file successfully uploaded
     console.log("file uploaded sucessfuly",response.url)
     return response
     



    }catch(error){
       FileSystem.unlikesync(localpath)//file deleted in the local path
    }

}










 cloudinary.v2.uploader.upload("dog.mp4", {
  resource_type: "video", 
  public_id: "my_dog",
  overwrite: true, 
  notification_url: "https://mysite.example.com/notify_endpoint"})
.then(result=>console.log(result));

export default cloudinary; 