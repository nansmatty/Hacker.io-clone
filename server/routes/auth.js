const express = require('express');
const {
	register,
	registerActivate,
	login,
} = require('../controllers/authController');
const { runValidations } = require('../validators');
const {
	userRegisterValidator,
	userLoginValidator,
} = require('../validators/authValidator');
const router = express.Router();

router.post('/register', userRegisterValidator, runValidations, register);
router.post('/login', userLoginValidator, runValidations, login);
router.post('/register/activate', registerActivate);

module.exports = router;
