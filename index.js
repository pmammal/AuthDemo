//dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

//mongoose
mongoose
	.connect('mongodb://localhost:27017/authDemo', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('mongo connection open!!');
	})
	.catch((err) => {
		console.log('oh no mongo ERROR!');
		console.log(err);
	});

//set
app.set('view engine', 'ejs');
app.set('views', 'views');

//use
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }));

//middleware
const requireLogin = (req, res, next) => {
	if (!req.session.user_id) {
		return res.redirect('/login');
	}
	next();
};

//routes
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
	req.session.user_id = user._id;
	res.redirect('/');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	const validPassword = await bcrypt.compare(password, user.password);
	if (validPassword) {
		req.session.user_id = user._id;
		res.redirect('/secret');
	} else {
		res.redirect('/login');
	}
});

app.post('/logout', (req, res) => {
	req.session.user_id = null;
	res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
	res.render('secret');
});

//server
app.listen(3000, () => {
	console.log('serving your app');
});
