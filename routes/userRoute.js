const express = require('express');
const router = express.Router();

const { signup, login , logout , forgetPassword , verifyOTP ,changePassword} = require('../controller/UserController');


const { authenticateToken, authorizeRole }= require('../middleware/auth');


router.get('/', (req, res) => {
  res.send("Welcome the Kyc-Chatbot ");
});


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOTP);
router.post('/change-password', changePassword);


// router.use(authenticateToken, authorizeRole('user'));
// router.post('/createfeedback', Createfeedback);
// router.get('/fetch_login_user', fetchUser);
// router.put('/update_name', updateName);
// router.put('/update_department', updateDepartment);
// router.put('/update_email', updateEmail);
// router.put('/update_password', updatePassword);






module.exports = router;