const express = require('express');
const { register } = require('../controllers/authController');
const { runValidations } = require('../validators');
const { userRegisterValidator } = require('../validators/authValidator');
const router = express.Router();

router.post('/register', userRegisterValidator, runValidations, register);

module.exports = router;
