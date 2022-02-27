const mongoose = require('mongoose');
const { createHmac } = require('crypto');

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			max: 12,
			unique: true,
			index: true,
			lowercase: true,
			required: true,
		},

		name: {
			type: String,
			trim: true,
			max: 32,
			required: [true, ' Please provide a name'],
		},

		email: {
			type: String,
			trim: true,
			required: [true, ' Please provide a email'],
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please provide a valid email',
			],
			lowercase: true,
		},
		hashed_password: {
			type: String,
			required: [true, 'Please add a password'],
		},

		salt: String,
		role: {
			type: String,
			default: 'suscriber',
		},
		resetPasswordLink: {
			data: String,
			default: '',
		},
	},
	{ timestamps: true }
);

//virtual fields

userSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

// methods > authenticate, encryptPassword, makeSalt

userSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	encryptPassword: function (password) {
		if (!password) return '';
		try {
			const hash = createHmac('sha256', this.salt)
				.update(password)
				.digest('hex');
			return hash;
		} catch (error) {
			return '';
		}
	},

	makeSalt: function () {
		return Math.round(new Date().valueOf() * Math.random()) + '';
	},
};

module.exports = mongoose.model('User', userSchema);
