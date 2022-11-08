process.env.UV_THREADPOOL_SIZE = 5;

const crypto = require('crypto');

const start = Date.now();
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5:', Date.now() - start);
});

/*
OUTPUTS:
On executing 1 pbkdf2 function-
1: 561

On executing all 5 with UV_THREADPOOL_SIZE=4
4: 1117
3: 1193
1: 1199
2: 1213
5: 1692

On executing all 5 with UV_THREADPOOL_SIZE=5
4: 1245
1: 1276
3: 1377
2: 1392
5: 1439

On executing all 5 with UV_THREADPOOL_SIZE=4
1: 566
2: 1143
3: 1866
4: 2395
5: 2940
*/
