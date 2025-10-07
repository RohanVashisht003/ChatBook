import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        userId: v.string()
    })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
})