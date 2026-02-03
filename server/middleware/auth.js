import User from "../database/models/User.js"
import jwt from "jsonwebtoken"
// Protecting the route
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")

        if (!user) return res.json({ success: false, message: "User not found" })
        req.user = user
        next()
    }
    catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })
    }
}

export const checkAuth = (req,res)=>{
    res.json({ success: true, user: req.user })
}