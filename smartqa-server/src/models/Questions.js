const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
    roomCode: { type: String, required: true},
    content: { type: String, required: true},
    //This should be ID from the User table
    createdBy: { type: String},
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Questions", questionsSchema);