const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword, role });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // ✅ Set JWT in cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // use true in production (HTTPS)
        sameSite: 'lax',
        maxAge: 3600000 // 1 hour
      });

      res.json({ message: 'Login successful', user });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  }
};

module.exports = authController;
