import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router()
router.route("/register").post(
     upload.fields([
        {
            name:"avtar",
            maxCount:1
        },
        {
            name:"coverimage ",
            maxCount:3

        }
     ]),
    registerUser)
// router.route("/login").post(registerUser)

export default router