const Category = require('../models/CategoryModel');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const s3 = new AWS.S3({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
});

exports.createCategory = (req, res) => {
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image upload failed',
			});
		}

		const { name, content } = fields;
		const { image } = files;
		const slug = slugify(name);
		const category = new Category({ name, slug, content });
		category.postedBy = req.user._id;

		// Restrict the imga upload size

		// if (image.size > 300000) {
		// 	res.status(400).json({
		// 		error: 'Image Size should less then 2mb',
		// 	});
		// }

		// upload Image on  aws S3

		const params = {
			Bucket: 'hackerioclone',
			Key: `category/${uuidv4()}`,
			Body: fs.readFileSync(image.filepath),
			ACL: 'public-read',
			ContentType: `image/jpg`,
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
	});
};

exports.getCategories = (req, res) => {
	//
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
