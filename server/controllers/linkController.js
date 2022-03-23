const Link = require('../models/LinkModel');
const slugify = require('slugify');

exports.createLink = (req, res) => {
	const { title, url, categories, type, medium } = req.body;
	const slug = url;
	let link = new Link({ title, url, categories, type, medium, slug });
	link.postedBy = req.user._id;
	link.save((err, data) => {
		if (err) {
			res.status(400).json({
				error: 'There is some error from our side. Please try later!',
			});
		}
		res.json({
			message: 'Link created successfully',
		});
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

exports.clickCount = (req, res) => {
	const { linkId } = req.body;
	Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, { new: true }).exec(
		(err, result) => {
			if (err) {
				return res.status(400).json({
					error: 'Could not update view count',
				});
			}

			res.json(result);
		}
	);
};

exports.getLink = (req, res) => {
	//
};

exports.updateLink = (req, res) => {
	const { id } = req.params;
	const { title, url, categories, type, medium } = req.body;
	const updatedLink = { title, url, categories, type, medium };
	Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
		(err, success) => {
			if (err) {
				res.status(400).json({
					error: 'There is problem from our side. Please try later!',
				});
			}
			res.json({
				message: 'Link updated successfully',
			});
		}
	);
};

exports.deleteLink = (req, res) => {
	const { id } = req.params;
	Link.findOneAndRemove({ _id: id }).exec((err, success) => {
		if (err) {
			res.status(400).json({
				error: 'There is problem from our side. Please try later!',
			});
		}

		res.json({
			message: 'Link removed successfully.',
		});
	});
};
