const Koa = require('koa');
const { koaBody } = require('koa-body');
const assets = require('koa-static');
const path = require('path');

const home = require('./home');
const games = require('./games');
const websocketCreator = require('./websocket');

const staticAssets = path.resolve(__dirname, '../', 'static');

function createServer() {
  let app = new Koa();
  
  app.on('error', (err, ctx) => {
    console.log(`Server Error: ${err}`);
    ctx.body = err;
  });
  app.use(koaBody());
  app.use(assets(staticAssets));
  app.use(home.routes());
  app.use(home.allowedMethods());
  app.use(games.routes());
  app.use(games.allowedMethods());
  return app;
}


function start(port) {
  return new Promise((resolve, reject) => {
    try {
      const app = createServer();
      const server = app.listen(port);

      websocketCreator(server);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = start;