exports.readUser = (req, res) => {
	req.profile.hashed_password = 'undefined';
	req.profile.salt = 'undefined';

	return res.json(req.profile);
};
