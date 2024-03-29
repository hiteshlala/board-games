const { durations } = require('./utils');
const Shogi = require('./shogi');
const Go = require( './go' );
const Avalon = require('./avalon');

const gameTooOld = (durations.minute * 45);
const maxGames = 20;
const cleanUpTime = durations.hour;

class GameDB {
  constructor() {
    this.games = {};
    this.timer = setInterval(() => this.launchCleanupTimer(), cleanUpTime);
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
      case 'avalon':
        newgame = new Avalon(player1);
        break;
    }
    if (newgame) {
      this.games[newgame.id] = newgame;
    }
    return newgame.id;

  }

  launchCleanupTimer() {
    const games = Object.values(this.games);
    console.log(`Game Idle Cleanup - checking ${games.length} games`);
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
        player1: game.player2,
        players: game.players,
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
        players: game.players,
        game: game.type,
        id: game.id
      }
    });

  }

}


module.exports = new GameDB();