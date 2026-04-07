import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// ✅ Proper config (FIXED ENV NAMES)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKYE,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

// ✅ Upload function (ROBUST + SAFE)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    // ✅ check file exists
    if (!fs.existsSync(localFilePath)) {
      console.log("File does not exist:", localFilePath);
      return null;
    }

    // ✅ upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ Upload Success:", response.secure_url);

    // ✅ delete local file after success
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log("❌ Cloudinary Error:", error);

    // ✅ delete file if exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };