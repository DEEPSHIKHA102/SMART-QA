const { validationResult } = require('express-validator');
const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");
const Users = require("../models/User");

const roomController = {
    createRoom: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { createdBy } = req.body;

            const user = await Users.findById(createdBy);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const room = await Rooms.create({ roomCode: code, createdBy });
            res.json(room);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getByRoomCode: async (req, res) => {
        try {
            const code = req.params.code;
            const room = await Rooms.findOne({ roomCode: code }).populate('createdBy');
            if (!room) return res.status(404).json({ message: 'Invalid room code' });
            res.json(room);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createQuestion: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { content, createdBy } = req.body;
            const { code } = req.params;

            const user = await Users.findById(createdBy);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const question = await Questions.create({ roomCode: code, content, createdBy });
            res.json(question);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getQuestion: async (req, res) => {
        try {
            const code = req.params.code;
            const questions = await Questions.find({ roomCode: code }).sort({ createdAt: -1 }).populate('createdBy');
            res.json(questions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    deleteRoom: async (req, res) => {
        try {
            const { code } = req.params;
            const deleted = await Rooms.findOneAndDelete({ roomCode: code });
            if (!deleted) return res.status(404).json({ message: 'Room not found' });
            await Questions.deleteMany({ roomCode: code });
            res.json({ message: 'Room and its questions deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const { code, id } = req.params;
            const question = await Questions.findOneAndDelete({ _id: id, roomCode: code });
            if (!question) return res.status(404).json({ message: 'Question not found' });
            res.json({ message: 'Question deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = roomController;
