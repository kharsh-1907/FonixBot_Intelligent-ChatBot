const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Chats = require('../Models/Chats');
const Messages = require('../Models/Message');

//Route 1: Fetching all chats from database  "/api/chats/fetchallchats".
router.get('/fetchallchats', fetchuser, async (req, res) => {
    // the user is found by using same **fetchuser** function(middleware)by it's user.id .
    try {
        const chat = await Chats.find({ user: req.user.id }).sort({ date: -1 });
        res.json(chat);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Some Server Error Occured");
    }

})
/**.................................................................................................... */
//Route 2: Creating chats **chats** from req.body  "/api/chats/createChats".
router.post('/createChats', fetchuser, async (req, res) => {
    try {
        const newChat = new Chats({
            user: req.user.id
        });
        const savedChat = await newChat.save();
        res.json(savedChat);
    }
    catch (err) {
        console.error(err.message);
        // console.log(err);
        res.status(500).send("Some Server Error Occured");
    }
})

/**..................................................................................................... */
// Route 3: Updating name of the chat(in Recent Search )from  req.body  "/api/chat/updateTitle/:chatId".
router.put('/updateTitle/:chatId', fetchuser, async (req, res) => {
    try {
        const { title } = req.body;
        const chat = await Chats.findById(req.params.chatId);

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
        chat.title = title;
        await chat.save();
        res.json(chat);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Some Server Error Occured");
    }
});

/**.................................................................................................... */
//Route 4: Deleting Chats  **chats** from req.body  "/api/chat/deletechats/:chatId".
router.delete('/deletechat/:chatId', fetchuser, async (req, res) => {
    try {
        const chat = await Chats.findById(req.params.chatId);
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

        await Messages.deleteMany({chat: req.params.chatId});
        await Chats.findByIdAndDelete(req.params.chatId);

        res.json({
            sucess: "True",
            message: "Chats deleted!!"
        })
    }
    catch (err) {
        console.error(err.message);
        // console.log(err);
        res.status(500).send("Some Server Error Occured");
    }
})

module.exports = router;