const express = require('express');
const { register, registerActivate } = require('../controllers/authController');
const { runValidations } = require('../validators');
const { userRegisterValidator } = require('../validators/authValidator');
const router = express.Router();

router.post('/register', userRegisterValidator, runValidations, register);
router.post('/register/activate', registerActivate);

module.exports = router;
