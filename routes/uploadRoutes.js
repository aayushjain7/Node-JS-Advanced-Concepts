const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

// CREATE THESE KEYS USING IAM USER AND POLICY
const s3 = new AWS.S3({
	credentials: {
		accessKeyId: keys.accessKeyId,
		secretAccessKey: keys.secretAccessKey,
	},
	region: 'ap-south-1',
});

// CREATE A BUCKET IN S3
// CREATE A POLICY FOR THE BUCKET
// ENABLE CORS FOR THE BUCKET
module.exports = (app) => {
	app.get('/api/upload', requireLogin, (req, res) => {
		const key = `${req.user.id}/${uuid()}.jpeg`;
		s3.getSignedUrl(
			'putObject',
			{
				Bucket: 'node-adv-concepts-udemy-blog',
				ContentType: 'image/jpeg',
				Key: key,
			},
			(err, url) => res.send({ key, url, err })
		);
	});
};
