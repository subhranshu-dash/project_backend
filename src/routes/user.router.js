import { Router } from "express";
import { logOut, registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",        // ✅ correct spelling
      maxCount: 1,
    },
    {
      name: "coverImage",    // ✅ correct case + no space
      maxCount: 1,
    },
  ]),
  registerUser
);
 router.route("/login").post(loginUser)

 //secure route 

 router.route("/logOut").post(verifyJWT ,logOut)

export default router;