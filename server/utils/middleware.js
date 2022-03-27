const expressJwt = require('express-jwt');
const Link = require('../models/LinkModel');
const User = require('../models/UserModel');

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ['HS256'],
});

exports.authMiddleware = (req, res, next) => {
	const userId = req.user._id;
	User.findOne({ _id: userId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User does not exists!',
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const userId = req.user._id;
	User.findOne({ _id: userId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User does not exists!',
			});
		}

		if (user.role !== 'admin') {
			return res.status(400).json({
				error: 'User access denied!',
			});
		}

		req.profile = user;
		next();
	});
};

exports.sameUserMiddleware = (req, res, next) => {
	const { id } = req.params;

	Link.findOne({ _id: id }).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: 'Could not find link',
			});
		}

		let authorizedUser =
			data.postedBy._id.toString() === req.user._id.toString();

		if (!authorizedUser) {
			res.status(400).json({
				error: 'You are not authorized',
			});
		}
		next();
	});
};
