import fetch from 'node-fetch';

const gameId = process.argv[2];
const live = process.argv[3] || false;

if (!gameId) {
  console.log('Missing game id');
  process.exit(1);
}

const url = live ? `http://hiteshlala.biz:6543/games/${gameId}` : `http://localhost:6543/games/${gameId}`;

const players = ['three', 'four', 'five'];

async function runner() {
  for(let player of players) {
    try {
      let result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ player }),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        },
      });
      result = await result.json();
      console.log(result);
    } catch(e) {
      console.log(player, e);
    }
  }
}

runner().catch(console.log);