const express = require('express');
const { createCategory } = require('../controllers/categoryController');
const router = express.Router();
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
} = require('../utils/middleware');
const { runValidations } = require('../validators');
const {
	categoryCreateValidator,
	categoryUpdateValidator,
} = require('../validators/categoryValidator');

router.post(
	'/category',
	categoryCreateValidator,
	runValidations,
	requireSignin,
	createCategory
);

module.exports = router;
