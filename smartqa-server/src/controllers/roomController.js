const { validationResult } = require('express-validator');
const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");
const Users = require("../models/User");
const { callGemini } = require("../services/geminiService");
const mongoose = require('mongoose');

const roomController = {
 createRoom: async (request, response) => {
  try {
    const { createdBy } = request.body;

    if (!createdBy) {
      return response.status(400).json({ message: 'createdBy is required' });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const room = await Rooms.create({
      roomCode: code,
      createdBy, 
    });

    response.json(room);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
},


  getByRoomCode: async (request, response) => {
    try {
      const code = request.params.code;
      const room = await Rooms.findOne({ roomCode: code });
      if (!room) return response.status(404).json({ message: 'Invalid room code' });
      response.json(room);
    } catch (error) {
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  createQuestion: async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });

    try {
      const { content, createdBy } = request.body;
      const { code } = request.params;

      if (!createdBy) {
      return response.status(400).json({ message: 'createdBy is required' });
    }

    const question = await Questions.create({
      roomCode: code,
      content,
      createdBy // ✅ now you control who asked the question
    });
    const io = request.app.get("io");
    io.to(code).emit("emit-question", question);

    response.json(question);
    } catch (error) {
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getQuestion: async (request, response) => {
    try {
      const code = request.params.code;
      const questions = await Questions.find({ roomCode: code }).sort({ createdAt: -1 });
      response.json(questions);
    } catch (error) {
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  generateTopQuestions: async (request, response) => {
    try{
      const code = request.params.code;

      const questions = await Questions.find({ roomCode: code});
      if(questions.length === 0) return response.json([]);

      const TopQuestions = await callGemini(questions);
      response.json(TopQuestions);
    }catch(error){
      console.log(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteRoom: async (request, response) => {
    try {
      const { code } = request.params;
      const deleted = await Rooms.findOneAndDelete({ roomCode: code });
      if (!deleted) return response.status(404).json({ message: 'Room not found' });
      await Questions.deleteMany({ roomCode: code });
      response.json({ message: 'Room and its questions deleted' });
    } catch (error) {
       console.error(error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },


deleteQuestion: async (request, response) => {
  try {
    const { code, id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: 'Invalid question ID' });
    }

    const question = await Questions.findOneAndDelete({
      _id: id,
      roomCode: code
    });

    if (!question) {
      return response.status(404).json({ message: 'Question not found' });
    }

    response.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
}

};

module.exports = roomController;
