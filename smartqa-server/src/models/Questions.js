const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Questions", questionsSchema);
