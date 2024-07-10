import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getUserByClerkId } from "./_utils"

export const get = query({
    args: {
        id: v.id("conversations")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        const conversation = await ctx.db.get(args.id);

        if (!conversation) {
            return null;
        }

        const membership = await ctx.db.query("conversationMembers")
            .withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", conversation._id))
            .unique();

        if (!membership) {
            throw new Error("You are not allowed to see this conversation");
        }

        const allConversationMembership = await ctx.db.query("conversationMembers")
            .withIndex("by_conversationId", q => q.eq("conversationId", args.id))
            .collect();

        if (!conversation.isGroup) {
            const otherMembership = allConversationMembership.filter(m => m.memberId !== currentUser._id)[0];

            if (!otherMembership) {
                throw new Error("Other member not found");
            }

            const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

            return {
                ...conversation,
                otherMember: {
                    ...otherMemberDetails,
                    lastSeenMessageId: otherMembership.lastSeenMessage
                },
                otherMembers: null
            };
        } else {
            const otherMembers = await Promise.all(allConversationMembership
                .filter(m => m.memberId !== currentUser._id)
                .map(async m => {
                    const member = await ctx.db.get(m.memberId);

                    if (!member) {
                        throw new Error("Member could not be found");
                    }

                    return {
                        _id: m._id,
                        username: member.username,
                        imageUrl: member.imageUrl
                    };
                }));

            return {
                ...conversation,
                otherMembers,
                otherMember: null
            };
        }
    }
});

export const createGroup = mutation({
    args: {
        members: v.array(v.id("users")),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversationId = await ctx.db.insert("conversations", {
            isGroup: true,
            name: args.name
        })

        await Promise.all([...args.members, currentUser._id].map(async memberId => {
            await ctx.db.insert("conversationMembers", {
                memberId,
                conversationId,
            })
        }))

    }
})

export const deleteGroup = mutation({
    args: {
        conversationId: v.id("conversations"),
    }, handler: async (ctx, args) =>  {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversation = await ctx.db.get(args.conversationId)

        if(!conversation) {
            throw new ConvexError("Conversation not found")
        }

        const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

        if(!memberships || memberships.length <= 1) {
            throw new ConvexError("This conversation does not have any members")
        }

        const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

        await ctx.db.delete(args.conversationId)

        await Promise.all(memberships.map(async membership => {
            await ctx.db.delete(membership._id)
        }))

        await Promise.all(messages.map(async message => {
            await ctx.db.delete(message._id)
        }))

    }
})

export const leaveGroup = mutation({
    args: {
        conversationId: v.id("conversations"),
    }, handler: async (ctx, args) =>  {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversation = await ctx.db.get(args.conversationId)

        if(!conversation) {
            throw new ConvexError("Conversation not found")
        }

        const membership = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)).unique()

        if(!membership) {
            throw new ConvexError("You are not a member of this group")
        }

        await ctx.db.delete(membership._id)

    }
})

export const deleteConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
    }, handler: async (ctx, args) =>  {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversation = await ctx.db.get(args.conversationId)

        if(!conversation) {
            throw new ConvexError("Conversation not found")
        }
        
        const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

        if(!memberships || memberships.length <= 1) {
            throw new ConvexError("This conversation does not have any members")
        }

        const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

        await ctx.db.delete(args.conversationId)

        await Promise.all(memberships.map(async membership => {
            await ctx.db.delete(membership._id)
        }))

        await Promise.all(messages.map(async message => {
            await ctx.db.delete(message._id)
        }))

    }
})

export const markRead = mutation({
    args: {
        conversationId: v.id("conversations"),
        messageId: v.id("messages"),
    }, handler: async (ctx, args) =>  {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found")
        }

        const membership = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)).unique()

        if(!membership) {
            return null
        }

        const lastMessage = await ctx.db.get(args.messageId)

        await ctx.db.patch(membership._id, {
            lastSeenMessage: lastMessage ? lastMessage._id : undefined,
        })

    }
})

export const createConversation = mutation({
    args: {
        id: v.id("users")
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new ConvexError("Unauthorized");
        }

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        })

        if(!currentUser) {
            throw new ConvexError("User not found");
        }

        const friend = await ctx.db.get(args.id);

        if(!friend){
            throw new ConvexError("There was an error starting the conversation")
        }

        const existingConversationMemberships = await ctx.db
            .query("conversationMembers")
            .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
            .collect();

        for (const membership of existingConversationMemberships) {
            const conversation = await ctx.db.get(membership.conversationId);
            if (!conversation?.isGroup) {
                const otherMember = await ctx.db
                    .query("conversationMembers")
                    .withIndex("by_conversationId", (q) => q.eq("conversationId", membership.conversationId))
                    .filter((q) => q.neq(q.field("memberId"), currentUser._id))
                    .unique();

                if (otherMember && otherMember.memberId === friend._id) {
                    throw new ConvexError("A conversation already exists with this user");
                }
            }
        }

        const conversationId = await ctx.db.insert("conversations", {
            isGroup: false
        })

        await ctx.db.insert("conversationMembers", {
            memberId: currentUser._id,
            conversationId
        })
        await ctx.db.insert("conversationMembers", {
            memberId: friend._id,
            conversationId
        })

        return conversationId

    }
})