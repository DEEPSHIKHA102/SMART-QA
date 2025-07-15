require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // ✅ new

const roomRoutes = require('./src/routes/roomRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ Enable cookie parsing

const corsConfig = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true // ✅ very important for cookies
};
app.use(cors(corsConfig));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log('DB Connection Error:', error));

// Routes
app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, (error) => {
  if (error) console.log('Server start error:', error);
  else console.log(`Server running on port ${PORT}`);
});
