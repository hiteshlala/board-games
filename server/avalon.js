const { createRandomKey } = require( './utils' );

/*
  players enter a waiting area until the min number of players
  arrive.

  owner of game can start the game

  once started no new players can join


  start game:
    each player gets assigned a role
      - evil
      - good
    one evil has to be Assassin
    one good has to be Merlin
    one evil can be Morgana
    one good can to be Percival

  evil players know who else is evil
  Merlin knows who is evil
  Percival knows who Merlin and Morgana could be
  Morgana pretends to be Merlin
  
  


players   5 6 7 8 9 10
good      3 4 4 5 6 6 
evil      2 2 3 3 3 4





*/

const playersCount = {
  "5": {good: 3, evil: 2},
  "6": {good: 4, evil: 2},
  "7": {good: 4, evil: 3},
  "8": {good: 5, evil: 3},
  "9": {good: 6, evil: 3},
  "10": {good: 6, evil: 4},
}

const evilLables = ['morgana', 'assassin', 'evil'];
const goodLables = ['merlin', 'percival', 'good'];

class Avalon {
  constructor( player1 ) {
    this.id = createRandomKey();
    this.type = 'avalon';
    this.minPlayers = 5;
    this.maxPlayers = 10;
    this.lastUpdated = Date.now();
    this.sockets = [];

    this.owner = player1;
    this.players = [player1]; // owner is always first in list
    this.started = false;
    this.extraInfo = {};
    this.turn = player1;
    this.impersonations = {};
    this.nominees = [];
    this.publicVotes = {};
    this.privateVotes = {};
    this.voteRequested = false;
    this.voteType = 'public';
    this.canRevealVote = false;
    this.voted = [];
    this.showVoteResult = false;
    this.questTeamVoteFails = 0;
    this.questCanStart = false;
    this.questors = [];
    this.voteResult = '';


    




  }

  onSocketMessage = (m) => {
    const msg = JSON.parse(m);
    if ( msg.chat ) this.chat( msg.chat );
    if ( msg.startGame ) this.startGame( msg.startGame );
    if ( msg.nominate ) this.nominate( msg.nominate );
    if ( msg.denominate ) this.denominate( msg.denominate );
    if ( msg.requestQuestVote ) this.requestQuestVote( msg.requestQuestVote );
    if ( msg.vote ) this.vote(msg.vote);
    if (msg.revealVotes) this.revealVotes(msg.revealVotes);
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


  }

  initPlayer = ( socket ) => {
    this.lastUpdated = Date.now();
    this.updateWatchers();
  }

  startGame = (data) => {
    if (this.started) return;
    this.lastUpdated = Date.now();
    this.started = true;
    const evilImpers = [];
    const goodImpers = [];
    
    const numberPlayers = this.players.length;
    const { evil, good } = playersCount[numberPlayers];
    data.characters.forEach( c => {
      switch(c) {
        case 'merlin':
        case 'percival':
          goodImpers.push(c);
          break;
        case 'morgana':
        case 'assassin':
          evilImpers.push(c);
          break;
      }
    });
    while (evilImpers.length < evil) {
      evilImpers.push('evil');
    }
    while (goodImpers.length < good) {
      goodImpers.push('good');
    }

    const allImpersonations = evilImpers.concat(goodImpers);
    for (let pers of this.players) {
      const idx = Math.floor(Math.random() * allImpersonations.length);
      const shouldplay = allImpersonations.splice(idx, 1)[0];
      this.impersonations[pers] = {
        player: pers,
        character: shouldplay,
        isEvil: evilLables.includes(shouldplay)
      };
    }

    const impersonations = Object.values(this.impersonations);
    for(let pers of this.players) {
      const impersonating = this.impersonations[pers];
      if (impersonating.character === 'merlin') {
        this.extraInfo[pers] = {
          roles: impersonations.map(i => ({...i, character: i.isEvil ? 'evil' : 'good'}))
        }
      }
      if (impersonating.character === 'percival') {
        this.extraInfo[pers] = {
          roles: impersonations.filter( i => (i.character === 'merlin' || i.character === 'morgana')).map( i => ({...i, character: 'merlin'}))
        }
      }
      if (impersonating.isEvil) {
        this.extraInfo[pers] = {
          evil: impersonations.filter( i => i.isEvil).map( i => i.player)
        }
      }
      
    }

    this.updateWatchers();
  }

  vote = ( ballot ) => {
    this.lastUpdated = Date.now();
    if (this.voteType === 'public') {
      this.publicVotes[ballot.player] = ballot.vote;
      this.voted.push(ballot.player);
      if (this.voted.length === this.players.length) {
        this.canRevealVote = true;
      }
    }
    this.updateWatchers();
  }

  nominate = (name) => {
    this.lastUpdated = Date.now();
    this.nominees.push(name);
    this.updateWatchers();
  }

  denominate = (name) => {
    this.lastUpdated = Date.now();
    this.nominees = this.nominees.filter( n => n !== name);
    this.updateWatchers();
  }

  requestQuestVote = () => {
    this.lastUpdated = Date.now();
    this.voteRequested = true;
    this.voted = [];
    this.publicVotes = {};
    this.privateVotes = {};
    this.updateWatchers();
  }
  
  revealVotes = (reveal) => {
    this.lastUpdated = Date.now();
    this.showVoteResult = reveal;
    if (this.voteType === 'public') {
      const totalVotes = this.players.length;
      const yes = Object.values(this.publicVotes).reduce((count, curr) => {
        return curr ? count + 1 : count;
      }, 0);
      if (yes > Math.floor(totalVotes / 2) ) {
        this.questCanStart = true;
        this.questors = [...this.nominees];
        this.voteResult = `Yes: ${yes} - No: ${Math.abs(totalVotes - yes)}`;
      }
      else {
        this.questTeamVoteFails++;
        

      }
    }
    else {}
    this.updateWatchers();
  }

  chat = ( data ) => {
    this.lastUpdated = Date.now();
    this.sockets.forEach( socket => {
      if ( socket && socket.readyState === socket.OPEN) {
        socket.send( JSON.stringify({ chat: data }) );
      }
    });
  }

  updateWatchers = () => {
    this.sockets.forEach( socket => {
      if ( socket && socket.readyState === socket.OPEN) {
        const publicVotes = (this.showVoteResult && this.voteType === 'public') ? { ...this.publicVotes } : undefined;
        const privateVotes = (this.showVoteResult && this.voteType === 'private' ) ? "count" : undefined;
        const data = {
          players: [...this.players],
          started: this.started,
          owner: this.owner,
          extraInfo: this.extraInfo[socket.gamePlayer],
          minPlayers: this.minPlayers,
          maxPlayers: this.maxPlayers,
          turn: this.turn,
          impersonating: this.impersonations[socket.gamePlayer],
          nominees: [...this.nominees],
          voteRequested: this.voteRequested,
          voted: [...this.voted],
          canRevealVote: this.canRevealVote,
          publicVotes,
          privateVotes,
          showVoteResult: this.showVoteResult,
          questTeamVoteFails: this.questTeamVoteFails,
          voteResult: this.voteResult,
          questCanStart: this.questCanStart
        };
        socket.send( JSON.stringify( data ) );
      }
    });
  }

}

module.exports = Avalon;