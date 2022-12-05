const path = require('path');

function getMessages(req, res) {
	// res.send('<ul><li>Message 1</li><li>Message 2</li></ul>');
	// res.sendFile(path.join(__dirname, '..', 'public', 'images', 'skimountain.jpg'));
	res.render('messages', {
		title: 'Messages',
		friend: 'Bob',
	});
}

function postMessages(req, res) {
	console.log('Updating messages...');
}

module.exports = {
	getMessages,
	postMessages,
};
