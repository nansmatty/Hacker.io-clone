const express = require('express');
const { registerAuth } = require('../controllers/authController');
const router = express.Router();

router.get('/register', registerAuth);

module.exports = router;
