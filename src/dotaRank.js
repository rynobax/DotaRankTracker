const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('../credentials/credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dotaranktracker.firebaseio.com'
});

exports.myHandler = (event, context, callback) => {
  const leaderboards = axios.create({
    baseURL: 'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=americas',
    timeout: 1000,
    headers: {}
  });
  leaderboards.get()
    .then(res => res.data)
    .then(getRank)
    .then(postRank);
}

function getRank({ leaderboard, time_posted }) {
  const possibilities = leaderboard
    .map((data, i) => ({
      ...data,
      rank: i + 1,
    }))
    .filter(({ name, team_id }) => name === 'Nukeydog' && team_id === 1123638);
  console.log(possibilities);
  const me = possibilities[0];
  return { rank: me.rank, time: time_posted };
}

function postRank({ rank, time }) {
  const db = admin.firestore();
  const dataRef = db.collection('ranks');
  const data = {
    time: new Date(time * 1000),
    rank,
  };
  dataRef.doc(String(time)).set(data);
}
