const { check } = require('express-validator');

exports.linkCreateValidator = [
	check('title').not().isEmpty().withMessage('Title is required'),
	check('url').not().isEmpty().withMessage('Url is required'),
	check('categories')
		.not()
		.isEmpty()
		.withMessage('At least one category is required'),
	check('type').not().isEmpty().withMessage('Pick a type free or paid'),
	check('medium').not().isEmpty().withMessage('Define the medium'),
];

exports.linkUpdateValidator = [
	check('title').not().isEmpty().withMessage('Title is required'),
	check('url').not().isEmpty().withMessage('Url is required'),
	check('categories')
		.not()
		.isEmpty()
		.withMessage('At least one category is required'),
	check('type').not().isEmpty().withMessage('Pick a type free or paid'),
	check('medium').not().isEmpty().withMessage('Define the medium'),
];
