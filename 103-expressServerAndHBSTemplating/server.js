const express = require('express');
const path = require('path');

const friendsRouter = require('./routes/friends.router');
const messagesRouter = require('./routes/messages.router');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const PORT = 3000;

app.use((req, res, next) => {
	const start = new Date();
	next();
	const delta = Date.now() - start;
	console.log(`${req.method} request for ${req.baseUrl}${req.url} took ${delta} ms`);
});

app.use('/site', express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Express Server',
		caption: 'Hello from the server!',
	});
});
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
