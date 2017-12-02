const dotaRank = require('./src/dotaRank');
exports.handler = (evt, ctx, cb) => {
  ctx.callbackWaitsForEmptyEventLoop = false;
  dotaRank
    .run()
    .then(rank => cb(null, 'Finished: ' + rank))
    .catch(err => cb(err));
}