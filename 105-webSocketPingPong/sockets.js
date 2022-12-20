let readyPlayerCount = 0;

function listen(io) {
	const pongNameSpace = io.of('/pong');
	pongNameSpace.on('connection', (socket) => {
		let room;
		console.log('user connected:: ', socket.id);

		socket.on('ready', () => {
			room = 'room' + Math.floor(readyPlayerCount / 2);
			socket.join(room);

			console.log('Player ready', socket.id, room);
			readyPlayerCount++;

			if (readyPlayerCount % 2 === 0) {
				pongNameSpace.in(room).emit('startGame', socket.id);
			}
		});

		socket.on('paddleMove', (data) => {
			socket.to(room).emit('paddleMove', data);
		});

		socket.on('ballMove', (data) => {
			socket.to(room).emit('ballMove', data);
		});

		socket.on('disconnect', (reason) => {
			console.log(`Client ${socket.id} disconnected: ${reason}`);
			socket.leave(room);
		});
	});
}

module.exports = { listen };
