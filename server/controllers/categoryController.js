const Category = require('../models/CategoryModel');
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
	//
};
exports.updateCategory = (req, res) => {
	//
};
exports.deleteCategory = (req, res) => {
	//
};
