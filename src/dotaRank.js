const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('../credentials/credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dotaranktracker.firebaseio.com'
});

exports.run = () => {
  const leaderboards = axios.create({
    baseURL: 'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=americas',
    timeout: 1000,
    headers: {}
  });
  return leaderboards.get()
    .then(res => res.data)
    .then(getRank)
    .then(postRank);
}

function getRank({ leaderboard, time_posted }) {
  const possibilities = leaderboard
    .map(({ time, name, team_id }, i) => ({
      time,
      name,
      team_id,
      rank: i + 1,
    }))
    .filter(({ name, team_id }) => name === 'Nukeydog' && team_id === 1123638);
  console.log(possibilities);
  const me = possibilities[0];
  return { rank: me.rank, time: time_posted };
}

function postRank({ rank, time }) {
  const db = admin.database();
  const dataRef = db.ref('ranks');
  const data = {
    time: new Date(time * 1000),
    rank,
  };
  return dataRef.child(String(time)).set(data)
    .then(() => rank);
}
