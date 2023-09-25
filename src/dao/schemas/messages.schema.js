import mongoose from "mongoose";

export const collectionMessages = "messages";

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const messagesModel = mongoose.model(collectionMessages, messageSchema);

export default messagesModel;
