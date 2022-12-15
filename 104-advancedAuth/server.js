//TO CREATE SELF SIGNED CERTIFICATE: openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

require('dotenv').config();

const PORT = 3000;

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
};
function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('accessToken', accessToken);
	console.log('refreshToken', refreshToken);
	console.log('profile', profile);
	done(null, profile);
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//save the session to cookie
passport.serializeUser((user, done) => {
	done(null, user.id);
});
//read the session from cookie
passport.deserializeUser((id, done) => {
	done(null, id);
});

const app = express();

app.use(helmet());

app.use(cookieSession({ name: 'session', maxAge: 24 * 60 * 60 * 1000, keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2] }));
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) {
	const isLoggedIn = req.isAuthenticated() && req.user;
	if (!isLoggedIn) {
		return res.status(401).send({ error: 'You are not logged in' });
	}
	next();
}

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/secret',
		session: true,
	}),
	(req, res) => {
		console.log('google called');
	}
);

app.get('/auth/logout', (req, res) => {
	req.logout();
	return res.redirect('/');
});

app.get('/secret', checkLoggedIn, (req, res) => {
	return res.send('Your personal secret value is Siiuuuuuuuu');
});

app.get('/failure', (req, res) => {
	return res.send('Login failed');
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https
	.createServer(
		{
			key: fs.readFileSync('key.pem'),
			cert: fs.readFileSync('cert.pem'),
		},
		app
	)
	.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
