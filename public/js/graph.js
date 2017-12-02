const d3 = Plotly.d3;

const WIDTH_IN_PERCENT_OF_PARENT = 100;
const HEIGHT_IN_PERCENT_OF_PARENT = 100;

const gd3 = d3.select('body')
  .append('div')
  .style({
    width: WIDTH_IN_PERCENT_OF_PARENT + '%',
    'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

    height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
    'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
  });

const gd = gd3.node();

const db = firebase.database();

db.ref('ranks')
  .on('value')
  .then(snap => snap.val())
  .then(graphStuff);

function graphStuff(data) {
  const x = [];
  const y = [];
  Object.values(data).forEach(e => {
    x.push(e.time);
    y.push(e.rank);
  });
  Plotly.plot(gd, [{
    type: 'scatter',
    x,
    y,
  }], {
    title: 'Nukeydog\'s Rank',
    font: {
      size: 16
    }
  });
}

window.onresize = () => {
  Plotly.Plots.resize(gd);
};