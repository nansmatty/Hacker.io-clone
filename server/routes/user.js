const express = require('express');
const { readUser } = require('../controllers/userController');
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
} = require('../utils/middleware');

const router = express.Router();

router.get('/user', requireSignin, authMiddleware, readUser);
router.get('/admin', requireSignin, adminMiddleware, readUser);

module.exports = router;
