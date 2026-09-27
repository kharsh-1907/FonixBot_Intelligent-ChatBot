const mongoose = require("mongoose")
const { Schema } = mongoose;

const msgschema = new Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default:Date.now
    }
})

module.exports = mongoose.models.messages  ||  mongoose.model("messages", msgschema)