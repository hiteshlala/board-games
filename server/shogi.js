const { createRandomKey } = require( './utils' );

class Shogi {
  constructor( player1 ) {
    this.id = createRandomKey();
    this.type = 'shogi';
    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.players = [player1]
    this.player1 = player1;
    this.player2 = '';
    this.pieces = [];
    this.lastUpdated = Date.now();
    this.sockets = [];
    this.init();
  }

  init() {
    const initialData = [
      { owner: 'player1', x: 0, y: 8, promoted: false, id: `p1-L-0-8`, captured: false, name: 'L', size: 'medium' },
      { owner: 'player1', x: 1, y: 8, promoted: false, id: `p1-N-1-8`, captured: false, name: 'N', size: 'medium' },
      { owner: 'player1', x: 2, y: 8, promoted: false, id: `p1-S-2-8`, captured: false, name: 'S', size: 'medium' },
      { owner: 'player1', x: 3, y: 8, promoted: false, id: `p1-G-3-8`, captured: false, name: 'G', size: 'medium' },
      { owner: 'player1', x: 4, y: 8, promoted: false, id: `p1-K-4-8`, captured: false, name: 'K', size: 'large' },
      { owner: 'player1', x: 5, y: 8, promoted: false, id: `p1-G-5-8`, captured: false, name: 'G', size: 'medium' },
      { owner: 'player1', x: 6, y: 8, promoted: false, id: `p1-S-6-8`, captured: false, name: 'S', size: 'medium' },
      { owner: 'player1', x: 7, y: 8, promoted: false, id: `p1-N-7-8`, captured: false, name: 'N', size: 'medium' },
      { owner: 'player1', x: 8, y: 8, promoted: false, id: `p1-L-8-8`, captured: false, name: 'L', size: 'medium' },
      { owner: 'player1', x: 1, y: 7, promoted: false, id: `p1-B-1-7`, captured: false, name: 'B', size: 'large' },
      { owner: 'player1', x: 7, y: 7, promoted: false, id: `p1-R-7-7`, captured: false, name: 'R', size: 'large' },
      { owner: 'player1', x: 0, y: 6, promoted: false, id: `p1-P-0-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 1, y: 6, promoted: false, id: `p1-P-1-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 2, y: 6, promoted: false, id: `p1-P-2-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 3, y: 6, promoted: false, id: `p1-P-3-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 4, y: 6, promoted: false, id: `p1-P-4-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 5, y: 6, promoted: false, id: `p1-P-5-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 6, y: 6, promoted: false, id: `p1-P-6-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 7, y: 6, promoted: false, id: `p1-P-7-6`, captured: false, name: 'P', size: 'small' },
      { owner: 'player1', x: 8, y: 6, promoted: false, id: `p1-P-8-6`, captured: false, name: 'P', size: 'small' },

      { owner: 'player2', x: 0, y: 0, promoted: false, id: `p2-L-0-0`, captured: false, name: 'L', size: 'medium' },
      { owner: 'player2', x: 1, y: 0, promoted: false, id: `p2-N-1-0`, captured: false, name: 'N', size: 'medium' },
      { owner: 'player2', x: 2, y: 0, promoted: false, id: `p2-S-2-0`, captured: false, name: 'S', size: 'medium' },
      { owner: 'player2', x: 3, y: 0, promoted: false, id: `p2-G-3-0`, captured: false, name: 'G', size: 'medium' },
      { owner: 'player2', x: 4, y: 0, promoted: false, id: `p2-K-4-0`, captured: false, name: 'K', size: 'large' },
      { owner: 'player2', x: 5, y: 0, promoted: false, id: `p2-G-5-0`, captured: false, name: 'G', size: 'medium' },
      { owner: 'player2', x: 6, y: 0, promoted: false, id: `p2-S-6-0`, captured: false, name: 'S', size: 'medium' },
      { owner: 'player2', x: 7, y: 0, promoted: false, id: `p2-N-7-0`, captured: false, name: 'N', size: 'medium' },
      { owner: 'player2', x: 8, y: 0, promoted: false, id: `p2-L-8-0`, captured: false, name: 'L', size: 'medium' },
      { owner: 'player2', x: 7, y: 1, promoted: false, id: `p2-B-7-1`, captured: false, name: 'B', size: 'large' },
      { owner: 'player2', x: 1, y: 1, promoted: false, id: `p2-R-1-1`, captured: false, name: 'R', size: 'large' },
      { owner: 'player2', x: 0, y: 2, promoted: false, id: `p2-P-0-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 1, y: 2, promoted: false, id: `p2-P-1-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 2, y: 2, promoted: false, id: `p2-P-2-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 3, y: 2, promoted: false, id: `p2-P-3-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 4, y: 2, promoted: false, id: `p2-P-4-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 5, y: 2, promoted: false, id: `p2-P-5-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 6, y: 2, promoted: false, id: `p2-P-6-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 7, y: 2, promoted: false, id: `p2-P-7-2`, captured: false, name: 'P', size: 'small' },
      { owner: 'player2', x: 8, y: 2, promoted: false, id: `p2-P-8-2`, captured: false, name: 'P', size: 'small' },
    ];
    this.pieces = [ ...initialData ];
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
    this.init();
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
        name2: this.player2
      };
      socket.send( JSON.stringify( data ) );
    }
  }

  move = ( data ) => {
    this.lastUpdated = Date.now();
    const { captureId, player, moved } = data;
    if ( captureId ) {
      const cappiece = this.pieces.find( i => i.id === captureId );
      cappiece.x = -1;
      cappiece.y = -1;
      cappiece.promoted = false;
      cappiece.owner = player;
      cappiece.captured = true;
    }

    if ( moved ) {
      const movepiece = this.pieces.find( p => p.id === moved.id );
      movepiece.x = moved.x;
      movepiece.y = moved.y;
      movepiece.promoted = moved.promoted;
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

module.exports = Shogi;