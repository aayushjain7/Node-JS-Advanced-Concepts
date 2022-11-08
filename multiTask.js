process.env.UV_THREADPOOL_SIZE = 1;

const https = require("https");
const crypto = require("crypto");
const fs = require("fs");

const start = Date.now();

function doRequest() {
	https
		.request("https://www.google.com", (res) => {
			res.on("data", () => {});
			res.on("end", () => {
				console.log("Request:", Date.now() - start);
			});
		})
		.end();
}

function doHash() {
	crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
		console.log("Hash:", Date.now() - start);
	});
}

doRequest();

fs.readFile("multitask.js", "utf8", () => {
	console.log("FS:", Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();

/* Outputs:
For UV_THREADPOOL_SIZE = 4
Request: xx
Hash: xx
FS: xx
Hash: xx
Hash: xx
Hash: xx
(
  FS is 2nd after 1st hash becoz FS takes place in 2 steps
  1. Get stats/info about file
  2. read the file
  After 1st step thread is free and is taken by other tasks (cryto) and once it is done, FS performs 2nd step.
)

For UV_THREADPOOL_SIZE = 5
FS: xx
Request: xx
Hash: xx
Hash: xx
Hash: xx
Hash: xx

For UV_THREADPOOL_SIZE = 5
Request: xx
Hash: xx
Hash: xx
Hash: xx
Hash: xx
FS: xx

Here the doRequest() call is moved to the very end of the file.

fs.readFile('multitask.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
});
 
doHash();
doHash();
doHash();
doHash();
doRequest();

With the default threadpool size (4) the request always returns last
Hash: 689
Hash: 690
FS: 691
Hash: 707
Hash: 709
Request: 812

Setting UV_THREADPOOL_SIZE to 5, the results are as expected:
FS: 44
Request: 148
Hash: 691
Hash: 699
Hash: 700
Hash: 705
*/
