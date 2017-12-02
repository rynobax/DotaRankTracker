const index = require('./index');
console.time('run');
index.handler({}, {}, (msg, err) => {
  console.log(msg ? msg : err);
  console.timeEnd('run');
  process.exit();
});
