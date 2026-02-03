import express from "express"
import {checkAuth, login, signUp, updateProfile} from "../controllers/userController.js"
import {protectRoute} from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/login", login)
userRouter.post("/signup", signUp)
userRouter.put("/update-profile", protectRoute, updateProfile)
userRouter.get("/check",protectRoute, checkAuth)

export default userRouter