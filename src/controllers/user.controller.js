import { uploadOnCloudinary } from "../utils/Cloudnary.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apierr.js";
import { ApiResponse } from "../utils/apires.js";

const registerUser = async (req, res) => {
  try {
    const { username, useremail, fullname, password } = req.body;

    // ✅ Validate fields
    if (
      [username, useremail, fullname, password].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { useremail }],
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists with this name/email");
    }

    // ✅ Safe file access (FIXED)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    console.log("FILES:", req.files);
    console.log("Avatar Path:", avatarLocalPath);

    // ✅ Avatar required
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    // ✅ Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar || !avatar.url) {
      throw new ApiError(400, "Avatar upload failed");
    }

    // ✅ Optional cover image
    let coverImage = "";
    if (coverImageLocalPath) {
      const uploadedCover = await uploadOnCloudinary(coverImageLocalPath);
      coverImage = uploadedCover?.url || "";
    }

    // ✅ Create user
    const user = await User.create({
      fullname,
      username: username.toLowerCase(),
      useremail,
      password,
      avatar: avatar.url,
      coverImage: coverImage,
    });

    // ✅ Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong during registration");
    }

    return res.status(201).json(
      new ApiResponse(201, createdUser, "User registered successfully")
    );
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export { registerUser };