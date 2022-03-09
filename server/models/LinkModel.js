const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			max: 256,
			required: true,
		},
		url: {
			type: String,
			trim: true,
			max: 256,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
			required: true,
			index: true,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
				required: true,
			},
		],
		type: {
			type: String,
			default: 'Free',
		},
		medium: {
			type: String,
			default: 'Video',
		},
		clicks: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Link', linkSchema);
