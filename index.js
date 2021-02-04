const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');

mongoose
	.connect('mongodb://localhost:27017/authDemo', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('mongo connection open!!');
	})
	.catch((err) => {
		console.log('oh no mongo ERROR!');
		console.log(err);
	});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('homepage');
});
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	const { password, username } = req.body;
	const hash = await bcrypt.hash(password, 12);
	const user = new User({
		username,
		password : hash
	});
	await user.save();
	res.redirect('/');
});

app.get('/secret', (req, res) => {
	res.send('this is secret');
});

app.listen(3000, () => {
	console.log('serving your app');
});
