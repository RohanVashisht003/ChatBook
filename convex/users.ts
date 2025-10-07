import { v } from "convex/values";
import { mutation, query } from "./_generated/server"
export const getUserByClerkUserId = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        if (!userId) {
            return null
        }
        return await ctx.db.query("users").withIndex("by_userId", (q) => q.eq("userId", userId)).first()
    }
})

// create and update user
export const upsertUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        userId: v.string()
    },
    handler: async (ctx, { name, email, imageUrl, userId }) => {
        const existingUser = await ctx.db.query("users").withIndex("by_userId", (q) => q.eq("userId", userId)).first()
        if (existingUser) {
            return await ctx.db.patch(existingUser._id, { name, email, imageUrl })
        }
        return await ctx.db.insert("users", { name, email, imageUrl, userId })
    }
})

export const searchUsers = query({
    args: {
        query: v.string()
    },
    handler: async (ctx, { query }) => {
        if (!query.trim()) {
            return []
        }
        const normalisedSearch = query.toLowerCase().trim()

        const getAllUsers = await ctx.db.query("users").collect()

        return getAllUsers.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)).slice(0, 20)
    } 
})