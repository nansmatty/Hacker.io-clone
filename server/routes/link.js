const express = require('express');
const {
	createLink,
	getAllLinks,
	getLink,
	updateLink,
	deleteLink,
	clickCount,
} = require('../controllers/linkController');
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
} = require('../utils/middleware');
const { runValidations } = require('../validators');
const {
	linkCreateValidator,
	linkUpdateValidator,
} = require('../validators/linkValidator');
const router = express.Router();

router.post(
	'/link',
	linkCreateValidator,
	runValidations,
	requireSignin,
	authMiddleware,
	createLink
);
router.get('/links', requireSignin, adminMiddleware, getAllLinks);
router.put('/click-count', clickCount);
router.get('/link/:id', getLink);
router.put(
	'/link/:id',
	linkUpdateValidator,
	runValidations,
	requireSignin,
	authMiddleware,
	updateLink
);
router.delete('/link/:id', requireSignin, authMiddleware, deleteLink);

module.exports = router;
