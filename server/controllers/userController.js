const User = require('../models/UserModel');
const Link = require('../models/LinkModel');

exports.readUser = (req, res) => {
	User.findOne({ _id: req.user._id }).exec((err, user) => {
		if (err || !user) {
			res.status(400).json({
				error: 'User not found',
			});
		}

		Link.find({ postedBy: user })
			.populate('categories', 'name slug')
			.populate('postedBy', 'name')
			.sort({ createdAt: -1 })
			.exec((err, links) => {
				if (err || !links) {
					return res.status(400).json({
						error:
							"You haven't created any link yet or There is a problem from our side",
					});
				}

				user.hashed_password = 'undefined';
				user.salt = 'undefined';

				res.json({ user, links });
			});
	});
};
