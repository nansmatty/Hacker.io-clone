const express = require('express');
const {
	createCategory,
	deleteCategory,
	updateCategory,
	getCategories,
	getCategory,
} = require('../controllers/categoryController');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../utils/middleware');
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
	adminMiddleware,
	createCategory
);

router.get('/categories', getCategories);
router.get('/category/:slug', getCategory);
router.put(
	'/category/:slug',
	categoryUpdateValidator,
	runValidations,
	requireSignin,
	adminMiddleware,
	updateCategory
);
router.delete(
	'/category/:slug',
	requireSignin,
	adminMiddleware,
	deleteCategory
);

module.exports = router;
