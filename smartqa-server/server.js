require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // ✅ fix: destructuring removed
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const roomRoutes = require('./src/routes/roomRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const ourServer = http.createServer(app);

const io = new Server(ourServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
    credentials: true
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

io.on("connection", (socket) => {
  console.log('New client connected:', socket.id);

  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);
    console.log(`User joined room: ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log('DB Connection Error:', error));

app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

const PORT = process.env.PORT || 5001;
ourServer.listen(PORT, (error) => {
  if (error) {
    console.log('Server not started due to:', error);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
