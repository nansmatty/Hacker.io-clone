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
	sameUserMiddleware,
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
router.post('/links', requireSignin, adminMiddleware, getAllLinks);
router.get('/links', getAllLinks);
router.put('/click-count', clickCount);
router.get('/link/:id', getLink);
router.put(
	'/link/:id',
	linkUpdateValidator,
	runValidations,
	requireSignin,
	authMiddleware,
	sameUserMiddleware,
	updateLink
);
router.put(
	'/admin/link/:id',
	linkUpdateValidator,
	runValidations,
	requireSignin,
	adminMiddleware,
	updateLink
);
router.delete(
	'/link/:id',
	requireSignin,
	authMiddleware,
	sameUserMiddleware,
	deleteLink
);
router.delete('/admin/link/:id', requireSignin, adminMiddleware, deleteLink);

module.exports = router;
