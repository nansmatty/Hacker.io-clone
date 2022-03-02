exports.registerEmailParams = (name, email, token) => {
	return {
		Source: process.env.EMAIL_FROM,
		Destination: {
			ToAddresses: [email],
		},
		ReplyToAddresses: [process.env.EMAIL_TO],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<html>
						<body>
							<h1 style="color: royalblue;">Hello ${name}</h1>
							<h3>Verify your email address</h3>
							<p>Please use this following link to complete your registration:</p>
							<p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
						</body>
					</html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Complete your registration',
			},
		},
	};
};

exports.forgotPasswordEmailParams = (name, email, token) => {
	return {
		Source: process.env.EMAIL_FROM,
		Destination: {
			ToAddresses: [email],
		},
		ReplyToAddresses: [process.env.EMAIL_TO],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<html>
						<body>
							<h1 style="color: royalblue;">Hello ${name}</h1>
							<h3>Reset your password</h3>
							<p>Please use this following link to reset your password:</p>
							<p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
						</body>
					</html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Reset your password',
			},
		},
	};
};
