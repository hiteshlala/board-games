const start = require('./server/server');

const port = 6543;

start(port)
.then(() => {
  console.log('Server listening on port', port);
})
.catch(console.log);