const { durations } = require('./utils');
const Shogi = require('./shogi');
const Go = require( './go' );

const gameTooOld = (durations.minute * 45);
const maxGames = 50;

class GameDB {
  constructor() {
    this.games = {};
    this.timer = setInterval(() => this.launchCleanupTimer(), durations.hour);
  }

  getGame(id) {
    return this.games[id];
  }

  get canCreateNewGame() {
    return Object.keys(this.games).length <= maxGames;
  }

  createGame(type, player1) {
    let newgame;
    switch (type) {
      case 'shogi':
        newgame = new Shogi(player1);
        break;
      case 'go':
        newgame = new Go(player1);
        break;
    }
    if (newgame) {
      this.games[newgame.id] = newgame;
    }
    return newgame.id;

  }

  launchCleanupTimer() {
    console.log('Game Idle Cleanup');
    const games = Object.values(this.games);
    games.forEach(game => {
      const isStale = (Date.now() - game.lastUpdated) > gameTooOld;
      if (isStale) {
        console.log(`Terminating game id=${game.id} between ${game.player1} and ${game.player2}`);
        game.end();
        delete this.games[game.id];
      }
    });
  }

  getStartedGamesList() {
    const games = Object.values(this.games);
    const started = games.filter(game => game.started);
    return started.map( game => {
      return {
        player1: game.player1,
        player2: game.player2,
        game: game.type,
        id: game.id
      }
    });
  }

  getWaitingGames() {
    const games = Object.values(this.games);
    const notstarted = games.filter(game => !game.started);
    return notstarted.map( game => {
      return {
        player1: game.player1,
        game: game.type,
        id: game.id
      }
    });

  }

}


module.exports = new GameDB();