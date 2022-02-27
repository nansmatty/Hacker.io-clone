const { check } = require('express-validator');

exports.userRegisterValidator = [
	check('name').not().isEmpty().withMessage('Name is required'),
	check('email').isEmail().withMessage('Must be valid email address'),
	check('password')
		.isLength({ min: 6 })
		.withMessage('Password must be ateleast 6 characters long'),
];
