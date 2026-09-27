const express = require("express");
const router = express.Router();

const Messages = require("../models/Message");
const Chats = require("../models/Chats");
const fetchuser = require("../middleware/fetchuser");
const { generateAIResponse } = require("../services/aiservices");


// GET ALL MESSAGES OF A CHAT
// GET /api/messages/:chatId
router.get("/:chatId", fetchuser, async (req, res) => {
    try {
        const chat = await Chats.findById(req.params.chatId)
        if (!chat) {
            return res.status(404).json({
                error: "Chat not found"
            });
        }

        if (chat.user.toString() !== req.user.id) {
            return res.status(401).json({
                error: "Not Allowed"
            });
        }

        const messages = await Messages.find({
            chat: req.params.chatId
        }).sort({ date: 1 });

        res.json(messages);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Server Error Occured");
    }
});


// SEND MESSAGE + GET AI RESPONSE
// POST /api/messages/:chatId
router.post("/:chatId", fetchuser, async (req, res) => {
    try {

        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                error: "Message content is required"
            });
        }

        // 1. Find chat
        const chat = await Chats.findById(req.params.chatId);

        if (!chat) {
            return res.status(404).json({
                error: "Chat not found"
            });
        }

        // 2. Verify chat belongs to logged-in user
        if (chat.user.toString() !== req.user.id) {
            return res.status(401).json({
                error: "Not Allowed"
            });
        }

        // 3. Save user's message
        const userMessage = new Messages({
            chat: req.params.chatId,
            role: "user",
            content: content.trim()
        });

        const savedUserMessage = await userMessage.save();

        // 4. Get conversation history
        const previousMessages = await Messages.find({
            chat: req.params.chatId
        })
        .sort({ date: 1 })
        .limit(20);

        // 5. Convert MongoDB messages to Gemini format
        const history = previousMessages.map(message => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [
                {
                    text: message.content
                }
            ]
        }));

        // 6. Send conversation history to Gemini
        const aiResponse = await generateAIResponse(history);

        // 7. Save AI response
        const assistantMessage = new Messages({
            chat: req.params.chatId,
            role: "assistant",
            content: aiResponse
        });

        const savedAssistantMessage = await assistantMessage.save();


        // 8. Return both messages
        res.json({
            userMessage: savedUserMessage,
            assistantMessage: savedAssistantMessage
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to process message"
        });
    }
});


module.exports = router;