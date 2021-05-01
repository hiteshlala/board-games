const WS = require('ws');

const gamesDb = require('./gamedb');
const {
  gameIdCookieName,
  gamePlayerCookieName
} = require('./utils');

function getCookie(name, cookiestring) {
  if (!name || !cookiestring || cookiestring.length === 0) return null;
  return cookiestring.split(';').reduce((result, pair) => {
    const keyval = pair.split('=').map((k) => k.toLowerCase().trim());
    return keyval[0] === name ? keyval[1] : result;
  }, null);
}

function websocketCreator(server) {
  const websoc = new WS.Server({
      perMessageDeflate: false,
      server: server,
      // path: '/api/websocket/:id', // implemented shouldHandle instead
    },
    () => {
      console.log('WebSocket Server Attached');
    }
  );

  websoc.shouldHandle = (req) => {
    const isws = /websocket/.test(req.url);
    const id = req.url.split('/')[2];
    const gameId = getCookie(
      gameIdCookieName,
      req.headers && req.headers.cookie
    );
    const player = getCookie(
      gamePlayerCookieName,
      req.headers && req.headers.cookie
    );
    const result = isws && id;

    req.gameId = id;
    req.gamePlayer = player;
    req.gamePlaying = id === gameId;

    return result;
  };

  websoc.on('listening', () => {
    console.log(`WebSockets Listening `);
  });

  websoc.on('error', (err) => {
    console.error(`WebSockets Error: ${err} `);
  });

  websoc.on('connection', (socket, websocket) => {
    const { gamePlayer, gamePlaying, gameId } = websocket;
    console.log('Socket connect Game id =', gameId, 'Game player =', gamePlayer, 'In game', gamePlaying );

    const game = gamesDb.getGame(gameId);
    if (game) {
      game.sockets.push( socket );
      socket.on('message', game.onSocketMessage);
      socket.on('close', game.onSocketClose);
      socket.on('error', game.onSocketError);
      game.initPlayer( socket );
    }
  });
}


module.exports = websocketCreator;