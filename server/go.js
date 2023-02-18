const { createRandomKey } = require( './utils' );

class Go {
  constructor( player1 ) {
    this.id = createRandomKey();
    this.type = 'go';
    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.players = [player1]
    this.player1 = player1;
    this.player2 = '';
    this.pieces = [];
    this.lastUpdated = Date.now();
    this.sockets = [];
    this.play1count = 180; // white
    this.play2count = 181; // black
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
    this.lastUpdated = Date.now();
    this.pieces = [];
    this.play1count = 180;
    this.play2count = 181;
  }

  get started() {
    return this.player1 && this.player2;
  }

  initPlayer = ( socket ) => {
    this.lastUpdated = Date.now();
    if ( socket && socket.readyState === socket.OPEN) {
      const data = {
        pieces: [...this.pieces ],
        name1: this.player1,
        name2: this.player2,
        play1count: this.play1count,
        play2count: this.play2count
      };
      socket.send( JSON.stringify( data ) );
    }
  }

  move = ( data ) => {
    this.lastUpdated = Date.now();
    const { capturePiece, player, moved, newPiece } = data;
    if ( capturePiece ) {
      const cappiece = this.pieces.find( i => i.id === capturePiece.id );
      cappiece.x = -1;
      cappiece.y = -1;
      cappiece.owner = player;
      cappiece.captured = true;
    }

    // must be before 'moved'
    if ( newPiece ) {
      this.pieces.push( newPiece );
      if ( newPiece.owner === 'player1' ) {
        this.play1count -= 1;
      }
      else {
        this.play2count -= 1;
      }
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
          name2: this.player2,
          play1count: this.play1count,
          play2count: this.play2count
        };
        socket.send( JSON.stringify( data ) );
      }
    });
  }

}

module.exports = Go;