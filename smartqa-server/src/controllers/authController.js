const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  register: async (request, response) => {
    try {
      const { name, email, password, role = 'user' } = request.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword, role });

      response.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Register error:', err);
      response.status(500).json({ message: 'Internal server error' });
    }
  },

  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email });
      if (!user) {
        return response.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      response.cookie('token', token, {
        httpOnly: true,
        secure: true,        // true in production with HTTPS
        sameSite: 'lax',
        maxAge: 3600000       // 1 hour
      });

      response.json({ message: 'Login successful', user });
    } catch (err) {
      console.error('Login error:', err);
      response.status(500).json({ message: 'Internal server error' });
    }
  },

  logout: (request, response) => {
    response.clearCookie('token');
    response.json({ message: 'Logged out successfully' });
  }
};

module.exports = authController;

