const express = require("express");
const crypto = require("crypto");
const app = express();

app.get("/", (req, res) => {
	crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
		res.send("Hi There");
	});
});

app.get("/fast", (req, res) => {
	res.send("This was fast!");
});

app.listen(3000, () => {
	console.log("Listening on PORT: 3000");
});

// pm2 start clusterpm2.js -i 0
// will handle cluster on its own i.e. how many instance of node server to start

// pm2 list
// to list all the cluster running on pm2

// pm2 show clusterpm2
// get detailed info about clusters running of name clusterpm2

// pm2 monit
// get a GUI to view all clusters and logs

// pm2 delete clusterpm2
// stop all instances of clusterpm2
