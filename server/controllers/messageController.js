import { Message } from "../database/models/Message.js";
import User from "../database/models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { userSocketMap, io } from "../server.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filterUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // count not seen messages
        const unseenMessages = {}

        const promises = filterUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.status(200).json({ success: true, users: filterUsers, unseenMessages });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id
        const otherUserId = req.params.id
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        })
        await Message.updateMany({ senderId: otherUserId, receiverId: userId }, { seen: true })
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params
        const otherUserId = req.params.id
        await Message.findByIdAndUpdate(id, { seen: true })
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error:error.message });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body.message
        const {id: receiverId} = req.params
        const senderId = req.user._id
        
        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        
        // Populate sender details for the message
        const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "fullName profilePic")
        
        // Emit to receiver if they're online
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message", populatedMessage)
        }
        
        res.status(200).json({ success: true, message: populatedMessage });
    }
    catch (error) {
        res.status(500).json({ error:error.message });
    }
}