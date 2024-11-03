const express = require('express');
const router = express.Router();

const { signup, login , logout } = require('../controller/UserController');


const { authenticateToken, authorizeRole }= require('../middleware/auth');


router.get('/', (req, res) => {
  res.send("Welcome the Kyc-Chatbot ");
});


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);






module.exports = router;