import { uploadOnCloudinary } from "../utils/Cloudnary.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apierr.js";
import { ApiResponse } from "../utils/apires.js";
import { asynchandeler } from "../utils/asyncHandeler.js";


// 🔥 generate access + refresh token
const accessTokenandrefreshToken = async (userid) => {
  try {
    if (!userid) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userid);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    console.log("🔥 ACTUAL ERROR:", error); // IMPORTANT
    throw new ApiError(
      500,
      error.message || "Token generation failed"
    );
  }
};



// 🔥 REGISTER
const registerUser = asynchandeler(async (req, res) => {

  const { username, useremail, fullname, password } = req.body;

  if ([username, useremail, fullname, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { useremail }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Avatar upload failed");
  }

  let coverImage = "";
  if (coverImageLocalPath) {
    const uploadedCover = await uploadOnCloudinary(coverImageLocalPath);
    coverImage = uploadedCover?.url || "";
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    useremail,
    password,
    avatar: avatar.url,
    coverImage,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});



// 🔥 LOGIN
const loginUser = asynchandeler(async (req, res) => {

  const { username, useremail, password } = req.body;

  // ✅ FIX condition
  if ((!username && !useremail) || !password) {
    throw new ApiError(400, "username/email and password required");
  }

  const user = await User.findOne({
    $or: [{ username }, { useremail }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const ispasswordValid = await user.isPasswordCorrect(password);

  if (!ispasswordValid) {
    throw new ApiError(401, "Invalid credentials"); // ✅ FIX status
  }

  const { accessToken, refreshToken } = await accessTokenandrefreshToken(user._id);

  const loggedInuser = await User.findById(user._id).select("-password -refreshToken"); // ✅ FIX

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInuser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});



// 🔥 LOGOUT
const logOut = asynchandeler(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});



export { registerUser, loginUser, logOut };