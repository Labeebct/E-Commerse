
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },{ timestamps: true });

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 }); 

module.exports = new mongoose.model('messages',messageSchema)