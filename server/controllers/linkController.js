const slugify = require('slugify');
const AWS = require('aws-sdk');
const Link = require('../models/LinkModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const { linkPublishedParams } = require('../utils/sendEmail');

AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
});

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

		// Send mail to users have categories in favourite
		User.find({ categories: { $in: categories } }).exec((err, users) => {
			if (err) {
				throw new Error(err);
				console.log('Error finding users to sendmail on link publish');
			}

			Category.find({ _id: { $in: categories } }).exec((err, result) => {
				data.categories = result;

				for (let i = 0; i < users.length; i++) {
					const params = linkPublishedParams(users[i], data);
					const sendEmailOnLinkCreate = new AWS.SES({
						apiVersion: '2010-12-01',
					})
						.sendEmail(params)
						.promise();

					sendEmailOnLinkCreate
						.then((success) => {
							console.log('Email submitted to SES', success);
							return;
						})
						.catch((err) => {
							console.log(`There is an error on sending email.`, err);
						});
				}
			});
		});
	});
};

exports.getAllLinks = (req, res) => {
	let limitLoad = req.body.limit ? parseInt(req.body.limit) : 10;
	let skipLoad = req.body.skip ? parseInt(req.body.skip) : 0;

	Link.find({})
		.populate('postedBy', 'name')
		.populate('categories', 'name slug')
		.sort({ createdAt: -1 })
		.skip(skipLoad)
		.limit(limitLoad)
		.exec((err, data) => {
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
	const { id } = req.params;
	Link.findOne({ _id: id }).exec((err, data) => {
		if (err) {
			res.status(400).json({
				error: 'Error on finding link. Please try later!',
			});
		}
		res.json(data);
	});
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

exports.popularLinks = (req, res) => {
	Link.find()
		.populate('postedBy', 'name')
		.populate('categories', 'name slug')
		.sort({ clicks: -1 })
		.limit(3)
		.exec((err, links) => {
			if (err) {
				return res.status(400).json({
					error: 'Links not found',
				});
			}
			res.json(links);
		});
};

exports.popularLinksBasedOnCategory = (req, res) => {
	const { slug } = req.params;

	Category.findOne({ slug }).exec((err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Couldn't load categories",
			});
		}

		Link.find({ categories: category })
			.sort({ clicks: -1 })
			.limit(3)
			.exec((err, links) => {
				if (err) {
					return res.status(400).json({
						error: 'Links not found',
					});
				}
				res.json(links);
			});
	});
};
