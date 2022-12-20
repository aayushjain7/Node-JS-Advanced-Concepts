const http = require('http');
const io = require('socket.io');

const app = require('./app');

const httpServer = http.createServer(app);
const socketServer = io(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

const sockets = require('./sockets');

const PORT = 3000;

httpServer.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

sockets.listen(socketServer);
