const Category = require('../models/CategoryModel');
const Link = require('../models/LinkModel');
const slugify = require('slugify');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
});

exports.createCategory = (req, res) => {
	const { name, content, image } = req.body;
	const slug = slugify(name);

	const base64data = new Buffer.from(
		image.replace(/^data:image\/\w+;base64,/, ''),
		'base64'
	);
	const type = image.split(';')[0].split('/')[1];

	const category = new Category({ name, slug, content });
	category.postedBy = req.user._id;

	const params = {
		Bucket: 'hackerioclone',
		Key: `category/${uuidv4()}.${type}`,
		Body: base64data,
		ACL: 'public-read',
		ContentEncoding: 'base64',
		ContentType: `image/${type}`,
	};

	s3.upload(params, (err, data) => {
		if (err) {
			console.log(err);
			res.status(400).json({ error: 'Upload to s3 failed' });
		}
		console.log('AWS UPLOAD RES DATA', data);
		category.image.url = data.Location;
		category.image.key = data.Key;

		// save to db
		category.save((err, success) => {
			if (err) {
				console.log(err);
				res.status(400).json({ error: 'Duplicate category' });
			}
			return res.json({
				message: 'Category created successfully',
			});
		});
	});
};

exports.getCategories = (req, res) => {
	Category.find({}).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: 'Categories could not load!',
			});
		}

		res.json(data);
	});
};
exports.getCategory = (req, res) => {
	const { slug } = req.params;

	let limitLoad = req.body.limit ? parseInt(req.body.limit) : 10;
	let skipLoad = req.body.skip ? parseInt(req.body.skip) : 0;

	Category.findOne({ slug })
		.populate('postedBy', '_id name username')
		.exec((err, category) => {
			if (err) {
				return res.status(400).json({
					error: 'Categories could not exist!',
				});
			}

			Link.find({ categories: category })
				.populate('postedBy', '_id name username')
				.populate('categories', 'name')
				.sort({ createdAt: -1 })
				.limit(limitLoad)
				.skip(skipLoad)
				.exec((err, link) => {
					if (err) {
						return res.status(400).json({
							error: 'There is no links associated with this category!',
						});
					}

					res.json({ category, link });
				});
		});
};
exports.updateCategory = (req, res) => {
	const { slug } = req.params;

	const { name, image, content } = req.body;

	Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec(
		(err, updatedCategory) => {
			if (err) {
				return res.status(400).json({
					error: 'Updating Category failed.',
				});
			}

			if (image) {
				//remove the existing image from s3 before uploading updated one
				const deleteParams = {
					Bucket: 'hackerioclone',
					Key: `${updatedCategory.image.key}`,
				};

				s3.deleteObject(deleteParams, function (err, data) {
					if (err) console.log('S3 image delete error', err);
					else console.log('S3 image deleted during update', data);
				});

				// handle upload image

				const params = {
					Bucket: 'hackerioclone',
					Key: `category/${uuidv4()}.${type}`,
					Body: base64data,
					ACL: 'public-read',
					ContentEncoding: 'base64',
					ContentType: `image/${type}`,
				};

				s3.upload(params, (err, data) => {
					if (err) {
						console.log(err);
						res.status(400).json({ error: 'Upload to s3 failed' });
					}
					console.log('AWS UPLOAD RES DATA', data);
					updatedCategory.image.url = data.Location;
					updatedCategory.image.key = data.Key;

					// save to db
					updatedCategory.save((err, success) => {
						if (err) {
							console.log(err);
							res.status(400).json({ error: 'Duplicate category' });
						}
						return res.json({
							message: 'Category updated successfully',
						});
					});
				});
			} else {
				res.json(updatedCategory);
			}
		}
	);
};
exports.deleteCategory = (req, res) => {
	const { id } = req.params;
	Category.findOneAndRemove({ _id: id }).exec((err, category) => {
		if (err) {
			return res
				.status(400)
				.json({ error: "Couldn't find or delete the category" });
		}

		const deleteParams = {
			Bucket: 'hackerioclone',
			Key: `${category.image.key}`,
		};

		s3.deleteObject(deleteParams, function (err, data) {
			if (err) console.log('S3 image delete error', err);
			else console.log('S3 image deleted during update', data);
		});

		res.json({
			message: 'Category deleted successfully',
		});
	});
};
