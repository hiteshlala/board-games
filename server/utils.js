function createRandomKey(key) {
  key = key || 'xxxxx-xxxxx-xxxxx';
  return key.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0;
    let v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const durations = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day:  1000 * 60 * 60 * 24,
}

const gameIdCookieName = 'shogi-or-go-id';
const gamePlayerCookieName = 'shogi-or-go-is-player';
const sessionlength = durations.day;

function createSessionCookieSetttings() {
  return {
    httpOnly: false,
    path: '/',
    overwrite: true,
    signed: false,
    expires: new Date( Date.now() + sessionlength ),
    sameSite: 'strict',
  }
}


module.exports = {
  createRandomKey,
  durations,
  gameIdCookieName,
  gamePlayerCookieName,
  createSessionCookieSetttings
};