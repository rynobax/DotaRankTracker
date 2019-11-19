const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("../credentials/credentials.json");

const URL_BASE =
  "http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dotaranktracker.firebaseio.com"
});

exports.run = () => {
  const core = axios.create({
    baseURL: `${URL_BASE}?division=americas&leaderboard=1`,
    timeout: 4000,
    headers: {}
  });
  const support = axios.create({
    baseURL: `${URL_BASE}?division=americas&leaderboard=2`,
    timeout: 4000,
    headers: {}
  });
  return Promise.all([
    core
      .get()
      .then(res => res.data)
      .then(getRank)
      .then(postRank("core")),
    support
      .get()
      .then(res => res.data)
      .then(getRank)
      .then(postRank("support"))
  ]);
};

function getRank({ leaderboard, time_posted }) {
  const me = leaderboard.find(
    ({ name, team_id }) => name === "Nukeydog" && team_id === 1123638
  );
  return { rank: me ? me.rank : null, time: time_posted };
}

const postRank = type => ({ rank, time }) => {
  if (!rank) return Promise.resolve();
  const db = admin.database();
  const dataRef = db.ref(type);
  const data = {
    time: new Date(time * 1000),
    rank
  };
  return dataRef
    .child(String(time))
    .set(data)
    .then(() => rank);
};
