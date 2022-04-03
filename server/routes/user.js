const express = require('express');
const { readUser, updateUser } = require('../controllers/userController');
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
} = require('../utils/middleware');
const { runValidations } = require('../validators');
const { userUpdateValidator } = require('../validators/authValidator');

const router = express.Router();

router.get('/user', requireSignin, authMiddleware, readUser);
router.get('/admin', requireSignin, adminMiddleware, readUser);
router.put(
	'/user',
	requireSignin,
	authMiddleware,
	userUpdateValidator,
	runValidations,
	updateUser
);

module.exports = router;
