const Router = require( 'koa-router' );

 
const home = new Router();
 
home.get( '/home', ctx => {
  console.log( `${ctx.method} - ${ctx.host} - ${ctx.path}` );
  let dest = ctx.query.dest;
  let message = ctx.query.message;
  let data = { 
    year: new Date().getFullYear(),
    page: 'home'
  };
  if ( message !== undefined ) {
    data[ 'message' ] = message;
  }
  if ( dest !== undefined ) {
    data[ 'dest' ] = dest;
  }
  ctx.body = data;
  return ctx.body;
});

module.exports = home;
 