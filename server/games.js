const Router = require( 'koa-router' );
const fs = require( 'fs' );
const path = require( 'path' );

const gameDb = require( './gamedb' );
const { 
  createSessionCookieSetttings, 
  gameIdCookieName, 
  gamePlayerCookieName,
  gameTypes
} = require( './utils' );

 
const games = new Router();

games.get( '/games', ctx => {
  console.log( `${ctx.method} - ${ctx.host} - ${ctx.path}` );
  let data = { 
    started: gameDb.getStartedGamesList(),
    created: gameDb.getWaitingGames(),
  };
  ctx.body = data;
  return ctx.body;
});

games.post( '/games', ctx => {
  console.log( `${ctx.method} - ${ctx.host} - ${ctx.path}` );
  const { type, player } = ctx.request.body;
  const notValidType = !gameTypes.includes(type);
  const canNotCreateGame = notValidType|| ( !player || player.length === 0 );
  if ( canNotCreateGame ) {
    ctx.body = {
      message: 'Game type and player name required.'
    };
  }
  else if ( !gameDb.canCreateNewGame ) {
    ctx.body = {
      message: 'Number of supported games exceeded, try again later.'
    };
  }
  else {
    const gameid = gameDb.createGame( type, player );
    const cookie = createSessionCookieSetttings();
    ctx.cookies.set(gameIdCookieName, gameid, cookie);
    if (type === 'avalon') {
      ctx.cookies.set(gamePlayerCookieName, player, cookie);
    }
    else {
      ctx.cookies.set(gamePlayerCookieName, 'player1', cookie);
    }
    ctx.body = {
      gameid
    };
  }
  return ctx.body;
});

games.post( '/games/:id', ctx => {
  console.log( `${ctx.method} - ${ctx.host} - ${ctx.path}` );
  const { player } = ctx.request.body;
  const gameid = ctx.params.id;
  const game = gameDb.getGame( gameid );
  let canJoinGame =  game && !game.started && player;
  let isSpaceToJoin = game.players.length < game.maxPlayers;
  if ( canJoinGame && isSpaceToJoin ) {
    game.player2 = player;
    game.players.push(player);
    const cookie = createSessionCookieSetttings();
    ctx.cookies.set(gameIdCookieName, gameid, cookie);
    if (game.type === 'avalon') {
      ctx.cookies.set(gamePlayerCookieName, player, cookie);
    }
    else {
      ctx.cookies.set(gamePlayerCookieName, 'player2', cookie);
    }

    ctx.body = {
      gameid
    };
  }
  else {
    ctx.body = {
      message: 'Game no longer available.'
    };
  }
  return ctx.body;
});

games.get( '/games/:id', ctx => {
  console.log( `${ctx.method} - ${ctx.host} - ${ctx.path}` );
  const id = ctx.params.id;
  const game = gameDb.getGame( id );
  if ( game ) {
    const pathToHtml = path.resolve(__dirname, '../', 'static', `${game.type}.html`);
    ctx.set( 'Content-Type', 'text/html' );
    ctx.body = fs.createReadStream( pathToHtml );
  }
  else {
    ctx.body = {
      message: 'Game no longer available.'
    }
  }
  return ctx.body;
});


module.exports = games;
