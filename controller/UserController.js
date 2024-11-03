const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const { addToBlacklist } = require('./blacklistedtoken');

exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if email is provided and is a valid string
  if (!email || !validator.isEmail(email)) {
    return res.status(400).send('Please provide a valid email address');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).send('Invalid credentials');
    }

    
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).send('Invalid credentials');
    }

    console.log('Password matches');

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      secretKey,
      { expiresIn: '30d' }
    );
    res.json({
      token: token,
      name:user.username,
      role: user.role
    });
  } catch (error) {
    console.log('Login error:', error.message);
    res.status(400).send(error.message);
  }
};

exports.logout = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    addToBlacklist(token);
    res.status(200).send({ message: 'Logged out successfully' });
  } else {
    res.status(400).send({ message: 'No token provided' });
  }
};

