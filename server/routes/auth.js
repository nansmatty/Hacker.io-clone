const express = require('express');
const {
	register,
	registerActivate,
	login,
	forgotPassword,
	resetPassword,
} = require('../controllers/authController');
const { runValidations } = require('../validators');
const {
	userRegisterValidator,
	userLoginValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} = require('../validators/authValidator');
const router = express.Router();

router.post('/register', userRegisterValidator, runValidations, register);
router.post('/login', userLoginValidator, runValidations, login);
router.post('/register/activate', registerActivate);
router.put(
	'/password/forgot',
	forgotPasswordValidator,
	runValidations,
	forgotPassword
);
router.put(
	'/password/reset',
	resetPasswordValidator,
	runValidations,
	resetPassword
);

module.exports = router;
