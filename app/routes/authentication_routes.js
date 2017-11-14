module.exports = function(app, db) {
	app.post('/auth/register', (req, res) => {
		db.put('user', {key: req.body.key, secretKey: req.body.secretKey});
		res.send('User ' + req.body.key + ' is registered with your secret key.');
	});

	app.get('/auth/user', (req, res) => {
		db.get('user');
		res.send(db.get('user'));
	});
};