module.exports = function(app, db) {
	app.post('/auth/register', (req, res) => {
		console.log(req.body);
		db.put('user', {key: req.body.key, keysecretKey: req.body.secretKey});
		res.send('User ' + req.body.key + ' is registered with your secret key.');
	});

	app.get('/auth/user', (req, res) => {
		db.get('user');
		res.send(db.get('user'));
	});
};