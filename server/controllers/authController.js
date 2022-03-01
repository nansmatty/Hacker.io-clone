const AWS = require('aws-sdk');

AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
});

// const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
	const { name, email } = req.body;

	const params = {
		Source: process.env.EMAIL_FROM,
		Destination: {
			ToAddresses: [email],
		},
		ReplyToAddresses: [process.env.EMAIL_TO],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<html><body><h1 style="color: royalblue;">Hello ${name}</h1><p>Test Email</p></body></html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Complete your registration',
			},
		},
	};

	const sendEmailOnRegister = new AWS.SES({ apiVersion: '2010-12-01' })
		.sendEmail(params)
		.promise();

	sendEmailOnRegister
		.then((data) => {
			console.log('Email submitted to SES', data);
			res.send('Email sent');
		})
		.catch((err) => {
			console.log('SES email on register', err);
			res.send('Email failed');
		});
};
