const expressJwt = require('express-jwt');
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
