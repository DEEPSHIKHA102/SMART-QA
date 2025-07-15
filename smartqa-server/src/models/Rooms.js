const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rooms", roomsSchema);