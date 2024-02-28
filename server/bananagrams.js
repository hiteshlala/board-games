const { createRandomKey } = require( './utils' );

/*
  players enter a waiting area until the min number of players
  arrive.

  owner of game can start the game

  once started no new players can join

  start game:
    create a board for each player - responsible for managing its tiles and where it lives on a grid
    distribute tiles to each player - use player count to determine number of tiles
    


  rules & other games:
  https://web.archive.org/web/20090517070229/http://www.bananagrams-intl.com/instructions.asp
  https://www.playbananagrams.com/game/bananaIsland
  https://www.youtube.com/watch?v=lIC6hH_GxUA&ab_channel=Bananagrams%2CInc.

*/

// https://web.archive.org/web/20090517070229/http://www.bananagrams-intl.com/instructions.asp
const tilesByPlayersCount = {
  '2': 21,
  '3': 21,
  '4': 21,
  '5': 15,
  '6': 15,
  '7': 11,
  '8': 11,
}

class Tiles {
  constructor() {
    this.numTiles = 144;
    this.tiles = [];
    this.makeTiles();
  }

  /*  Tile
    {
      id: string identifier remains constant throught game
      language: selected language for player
      board: players board id
      row: row index on board
      col: column index on board
      english: english letter
      ukrainian: ukrainian letter
    }
  */
  makeTiles() {
    const englishLetters = 'JKQXZJKQXZBCFHMPVWYBCFHMPVWYBCFHMPVWYGGGGLLLLLDSUDSUDSUDSUDSUDSUNNNNNNNNTRTRTRTRTRTRTRTRTROOOOOOOOOOOIIIIIIIIIIIIAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEE';
    const ukrainianLetters = "'ҐЩФЄЮШЦЇЖЬЙХЧ'ҐЩФЄЮШЦЇЖЬЙХЧГБЯЗГБЯЗГБЯЗУПЛДУПЛДУПЛДУПЛДМСКВМСКВМСКВМСКВМСКВРТІЕРТІЕРТІЕРТІЕРТІЕРТІЕНИНИНИНИНИНИНИНИАААААААААААООООООООООООООООО"
    console.log(ukrainianLetters.length)
    for(let i = 0; i < this.numTiles; i++) {
      this.tiles.push({
        id: createRandomKey('tile-xx-xxxx-xxxx'),
        placedOnBoard: false,
        row: -1,
        col: -1,
        english: englishLetters[i],
        ukrainian: ukrainianLetters[i],
        language: '',
      });
    }
  }

  selectTile() {
    const index = Math.floor(Math.random() * this.tiles.length);
    const tile = this.tiles.splice(index, 1);
    return tile[0];
  }
  
  /* 
    https://en.wikipedia.org/wiki/Scrabble_letter_distributions

    Scrabble English (100)
    2 blank tiles (scoring 0 points)
    1 point: E ×12, A ×9, I ×9, O ×8, N ×6, R ×6, T ×6, L ×4, S ×4, U ×4
    2 points: D ×4, G ×3
    3 points: B ×2, C ×2, M ×2, P ×2
    4 points: F ×2, H ×2, V ×2, W ×2, Y ×2
    5 points: K ×1
    8 points: J ×1, X ×1
    10 points: Q ×1, Z ×1

    Scrabble Ukrainian (104)
    2 blank tiles (scoring 0 points)
    1 point: О ×10, А ×8, И ×7, Н ×7, Е ×5, І ×5, Т ×5, Р ×5, В ×4
    2 points: К ×4, С ×4, М ×4, Д ×3, Л ×3, П ×3
    3 points: У ×3
    4 points: З ×2, Я ×2, Б ×2, Г ×2,
    5 points: Ч ×1, Х ×1, Й ×1, Ь ×1
    6 points: Ж ×1, Ї ×1, Ц ×1, Ш ×1
    7 points: Ю ×1
    8 points: Є ×1, Ф ×1, Щ ×1
    10 points: Ґ ×1, ' ×1


    https://en.wikipedia.org/wiki/Bananagrams
    Bananagrams (144)
    2: J, K, Q, X, Z
    3: B, C, F, H, M, P, V, W, Y
    4: G
    5: L
    6: D, S, U
    8: N
    9: T, R
    11: O
    12: I
    13: A
    18: E

    JKQXZJKQXZBCFHMPVWYBCFHMPVWYBCFHMPVWYGGGGLLLLLDSUDSUDSUDSUDSUDSUNNNNNNNNTRTRTRTRTRTRTRTRTROOOOOOOOOOOIIIIIIIIIIIIAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEE
    
    2: ', Ґ, Щ, Ф, Є, Ю, Ш, Ц, Ї, Ж, Ь, Й, Х, Ч
    3: Г, Б, Я, З
    4: У, П, Л, Д
    5: М, С, К, В
    6: Р, Т, І, Е
    8: Н, И
    11: А
    17: О

    'ҐЩФЄЮШЦЇЖЬЙХЧ'ҐЩФЄЮШЦЇЖЬЙХЧГБЯЗГБЯЗГБЯЗУПЛДУПЛДУПЛДУПЛДМСКВМСКВМСКВМСКВМСКВРТІЕРТІЕРТІЕРТІЕРТІЕРТІЕНИНИНИНИНИНИНИНИАААААААААААООООООООООООООООО

    https://en.wikipedia.org/wiki/Ukrainian_alphabet

    listed in most to least used, Chatgpt generated these and missed 4 Ukrainian chars!?

    E T A O I N S H R D L C U M W F G Y P B V K X Q J Z

    О А Е И Н В Р Т К С Л М У Я Д П З Б Г Ч І Й Ж Ш Ц Ь Ю Ф Ї Є  Х Щ Ґ '
  */
}

class Board {
  constructor(language) {
    this.id = createRandomKey('board-xx-xxxx-xxxx');
    this.dimension = 20;
    this.tiles = [];
    this.language = language;
  }

  moveTile({ col, row, tileId }) {
    const tile = this.tiles.find(t => t.id === tileId);
    tile.row = row;
    tile.col = col;
    tile.placedOnBoard = tile.row > -1 && tile.col > -1;
  }

  addTile(tile) {
    tile.language = this.language;
    this.tiles.push(tile);
  }

  getBoard() {
    return this.tiles.filter((tile) => tile.placedOnBoard);
  }

  getTilePool() {
    return this.tiles.filter((tile) => !tile.placedOnBoard)
  }

}

class Bananagrams {
  constructor( player1 ) {
    this.id = createRandomKey('bananagrams-xx-xxxx-xxxx');
    this.type = 'bananagrams';
    this.minPlayers = 2;
    this.maxPlayers = 8;
    this.lastUpdated = Date.now();
    this.sockets = [];
    this.tiles = new Tiles();

    this.owner = player1;
    this.players = [player1]; // owner is always first in list
    this.started = false;
    this.extraInfo = {};
    this.turn = player1;
    this.playerBoards = {
      // [player]: {
      //   board: new Board(language)
      // }
    };
    this.playerLanguages = {};
  }

  onSocketMessage = (m) => {
    const msg = JSON.parse(m);
    console.log(msg);
    this.lastUpdated = Date.now();
    if (msg.chat) this.chat(msg.chat);
    if (msg.startGame) this.startGame(msg.startGame);
    if (msg.selectLanguage) this.selectLanguage(msg.selectLanguage);
    if (msg.moveTile) this.moveTile(msg.moveTile);

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

  initPlayer = ( socket ) => {
    this.lastUpdated = Date.now();
    this.updateWatchers();
  }

  startGame = (data) => {
    if (this.started) return;
    this.started = true;
    
    const numberPlayers = this.players.length;
    this.players.forEach((player) => {
      this.playerBoards[player] = new Board(this.playerLanguages[player] || 'english');
    });
    
    const numTilesPerPlayer = tilesByPlayersCount[numberPlayers];
    for(let tiles = 0; tiles < numTilesPerPlayer; tiles++) {
      this.players.forEach((player) => {
        let tile = this.tiles.selectTile();
        this.playerBoards[player].addTile(tile);
      });
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
          players: [...this.players],
          started: this.started,
          owner: this.owner,
          extraInfo: this.extraInfo[socket.gamePlayer],
          minPlayers: this.minPlayers,
          maxPlayers: this.maxPlayers,
          playerBoards: this.players.map(player => ({
            player,
            board: this.playerBoards[player]?.getBoard(),
          })),
          myTilePool: this.playerBoards[socket.gamePlayer]?.getTilePool(),
        };

        socket.send( JSON.stringify( data ) );
      }
    });
  }

  selectLanguage = ({ language, player }) => {
    this.playerLanguages[player] = language;
  }

  moveTile = ({tileId, player, row, col}) => {
    if (this.started) {
      this.playerBoards[player]?.moveTile({ tileId, row, col });
      this.updateWatchers();
    }
  }

}

module.exports = Bananagrams;