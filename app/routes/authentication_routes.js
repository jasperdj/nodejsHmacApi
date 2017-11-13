module.exports = function(app, db) {
	app.post('/auth/register', (req, res) => {
		console.log(req.body);
		//db.put('user', {username: req.body.username, password: req.body.password});
		res.send('User ' + req.body.username + ' is registered.');
	});
	
	app.get('/auth/user', (req, res) => {
		db.get('user');
		res.send(db.get('user'));
	});
};