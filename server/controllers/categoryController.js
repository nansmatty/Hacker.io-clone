const Category = require('../models/CategoryModel');
const slugify = require('slugify');

exports.createCategory = (req, res) => {
	const { name, content } = req.body;
	const slug = slugify(name);
	const imageDetails = {
		url: `https://via.placeholder.com/150.png?text=${process.env.CLIENT_URL}`,
		key: '123',
	};

	const category = new Category({ name, slug, image: imageDetails, content });
	category.postedBy = req.user._id;

	category.save((err, data) => {
		if (err) {
			console.log('CATEGORY CREATE ERROR', err);
			res.status(400).json({
				error: 'Category create failed!',
			});
		}

		res.json(data);
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
