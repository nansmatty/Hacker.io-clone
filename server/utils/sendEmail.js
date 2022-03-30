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

exports.linkPublishedParams = (user, data) => {
	return {
		Source: process.env.EMAIL_FROM,
		Destination: {
			ToAddresses: [user.email],
		},
		ReplyToAddresses: [process.env.EMAIL_TO],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<html>
						<body>
							<h1 style="color: royalblue;">Hello ${user.name}</h1>
							<h3New link published </h3>
							<p>A new link titled <b>${
								data?.title
							}</b> has been published in the following categories.</p>
							${data?.categories
								?.map((category) => {
									return `
									<div>
										<h3>${category.name}</h3>
										<img src="${category.image.url}" alt="${category.name}" height="50" />
										<h4><a href="${process.env.CLIENT_URL}/links/${category.slug}">Check this out!</a></h4>
									</div>
								`;
								})
								.join('-------------')}
								
							<br />
							<p>Do not want to recieve notifications?</p>
							<p>Turn off notifications by going to your <b>Dashboard</b> > <b>Update profile</b> and <b>Uncheck the categories</b></p>
							<p><a href="${
								process.env.CLIENT_URL
							}/user/profile/update">Profile Update</a></p>

						</body>
					</html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'New link published',
			},
		},
	};
};
