const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { addToBlacklist } = require('./blacklistedtoken');

exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!validator.isEmail(email)) {
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
      confirmPassword: hashedPassword 
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


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host:'http://smtp.gmail.com',
  port:  465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetPasswordToken = code;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you  have requested the reset of the password for your account.\n\n
        Please use the following code to complete the process:\n\n
        ${code}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error: ', err);
      } else {
        res.status(200).json({ message: 'Verification code sent. Please check your email.' });
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetPasswordToken !== otp || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};