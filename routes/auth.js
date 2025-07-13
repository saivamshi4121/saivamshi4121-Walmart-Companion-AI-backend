const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});
const User = mongoose.model('User', userSchema);

// Create default admin if not exists
const createDefaultAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ email: 'admin@admin.com', password: hashedPassword, role: 'admin' });
    console.log('Default admin created: admin@admin.com/admin123');
  }
};
createDefaultAdmin();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    console.error('Login error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 