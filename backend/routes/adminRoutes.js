const express = require('express');
const { sendAdminLoginOtpControllers, verifyAdminLoginOtpControllers } = require('../controllers/adminControllers');


const router = express.Router()

// Admin Login Otp Router
router.post('/send-login-otp', sendAdminLoginOtpControllers);

// Admin Verify Login Otp Router
router.post('/verify-login-otp', verifyAdminLoginOtpControllers);


module.exports = router;