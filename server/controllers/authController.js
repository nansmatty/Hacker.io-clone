const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const User = require('../models/UserModel');
const { registerEmailParams } = require('../utils/sendEmail');

AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
});

exports.register = (req, res) => {
	const { name, email, password } = req.body;

	User.findOne({ email }).exec((err, user) => {
		if (user) {
			console.log(err);
			return res.status(400).json({
				error: 'Email is taken',
			});
		}
		// generate jwt with user name email and password

		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{
				expiresIn: '10m',
			}
		);

		const params = registerEmailParams(name, email, token);

		const sendEmailOnRegister = new AWS.SES({ apiVersion: '2010-12-01' })
			.sendEmail(params)
			.promise();

		sendEmailOnRegister
			.then((data) => {
				console.log('Email submitted to SES', data);
				res.json({
					message: `Email has been sent to ${email}, Follow the instruction to complete your registration`,
				});
			})
			.catch((err) => {
				console.log('SES email on register', err);
				res.json({
					message: `We could not verify your email. Please try again after sometime.`,
				});
			});
	});
};

exports.registerActivate = (req, res) => {
	const { tokenId } = req.body;

	jwt.verify(
		tokenId,
		process.env.JWT_ACCOUNT_ACTIVATION,
		function (err, decoded) {
			if (err) {
				return res.status(401).json({ error: 'Expired Link. Try Again' });
			}

			const { name, email, password } = jwt.decode(tokenId);
			const username = nanoid(9);

			User.findOne({ email }).exec((err, user) => {
				if (user) {
					return res.status(400).json({
						error: 'Email is taken',
					});
				}

				//register or save new user
				const newUser = new User({ username, name, email, password });
				newUser.save((err, user) => {
					if (err) {
						return res.status(400).json({
							error: 'There is some problem. Please try again after sometimes',
						});
					}
					return res.json({
						message: 'Registration success. Please Login',
					});
				});
			});
		}
	);
};

exports.login = (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User does not exists!',
			});
		}

		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: 'Invalid Credentials!',
			});
		}

		// Generate token and sent to client
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		const { _id, name, email, role } = user;

		return res.json({
			token,
			user: { _id, name, email, role },
		});
	});
};
