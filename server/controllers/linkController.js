const Link = require('../models/LinkModel');
const slugify = require('slugify');

exports.createLink = (req, res) => {
	const { title, url, categories, type, medium } = req.body;
	const slug = url;
	let link = new Link({ title, url, categories, type, medium, slug });
	link.postedBy = req.user._id;
	// categories
	let arrayOfCategories = categories && categories.split(',');
	link.categories = arrayOfCategories;
	link.save((err, data) => {
		if (err) {
			res.status(400).json({
				error: 'There is some error from our side. Please try later!',
			});
		}
		res.json(data);
	});
};

exports.getAllLinks = (req, res) => {
	Link.find({}).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: 'Could not list link.',
			});
		}
		res.json(data);
	});
};

exports.getLink = (req, res) => {
	//
};

exports.updateLink = (req, res) => {
	//
};

exports.deleteLink = (req, res) => {
	//
};
