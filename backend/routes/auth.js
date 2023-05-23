const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');



router.post('/signup', authController.handleSignup);

router.post('/login', authController.handleLogin);


module.exports = router;