const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			max: 32,
		},
		slug: {
			type: String,
			lowercase: true,
			unique: true,
			index: true,
		},
		image: {
			url: String,
			key: String,
		},
		content: {
			type: {},
			min: 10,
			max: 200000,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Category', categorySchema);
