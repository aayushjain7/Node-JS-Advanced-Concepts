process.env.UV_THREADPOOL_SIZE = 1;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log('Request:', Date.now() - start);
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('Hash:', Date.now() - start);
  });
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
  console.log('FS:', Date.now() - start);
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
*/
