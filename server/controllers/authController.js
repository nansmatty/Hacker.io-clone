const AWS = require('aws-sdk');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
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
