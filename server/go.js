const { createRandomKey } = require( './utils' );

class Go {
  constructor( player1 ) {
    this.id = createRandomKey();
    this.type = 'shogi';
    this.player1 = player1;
    this.player2 = '';
    this.pieces = [];
    this.lastUpated = Date.now();
    this.sockets = [];
    this.init();
  }

  init() {
    this.pieces = [
      { owner: 'player2', x: 8, y: 2, id: `p2-P-8-2`, captured: false, name: 'B' },
    ];
  }

  onSocketMessage = (m) => {
    const msg = JSON.parse(m);
    if ( msg.move ) this.move( msg.move );
    if ( msg.chat ) this.chat( msg.chat );
  }
  onSocketClose = (e) => {
    console.log( 'socket close', e.message || e);
  }
  onSocketError = (e) => {
    console.log( 'socket error', e.message || e);
  }

  end = () => {
    this.sockets.forEach( socket => {
      if ( socket ) {
        socket.close();
        socket = undefined;
      }
    });
  }

  restart = () => {
    this.lastUpated = Date.now();
    this.init();
  }

  get started() {
    return this.player1 && this.player2;
  }

  initPlayer = ( socket ) => {
    this.lastUpated = Date.now();
    if ( socket && socket.readyState === socket.OPEN) {
      const data = {
        pieces: [...this.pieces ],
        name1: this.player1,
        name2: this.player2
      };
      socket.send( JSON.stringify( data ) );
    }
  }

  move = ( data ) => {
    this.lastUpated = Date.now();
    const { captureId, player, moved } = data;
    if ( captureId ) {
      const cappiece = this.pieces.find( i => i.id === captureId );
      cappiece.x = -1;
      cappiece.y = -1;
      cappiece.owner = player;
      cappiece.captured = true;
    }

    if ( moved ) {
      const movepiece = this.pieces.find( p => p.id === moved.id );
      movepiece.x = moved.x;
      movepiece.y = moved.y;
      movepiece.captured = moved.captured;
    }

    this.updateWatchers();
  }

  chat = ( data ) => {
    this.sockets.forEach( socket => {
      if ( socket && socket.readyState === socket.OPEN) {
        socket.send( JSON.stringify({ chat: data }) );
      }
    });
  }

  updateWatchers = () => {
    this.sockets.forEach( socket => {
      if ( socket && socket.readyState === socket.OPEN) {
        const data = {
          pieces: [...this.pieces ],
          name1: this.player1,
          name2: this.player2
        };
        socket.send( JSON.stringify( data ) );
      }
    });
  }

  



  
}

module.exports = Go;