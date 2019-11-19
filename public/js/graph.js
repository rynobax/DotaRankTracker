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

db.ref('/')
  .once('value')
  .then(snap => {
    graphStuff(snap.val());
  });

function makeTrace(name, color, data) {
  const x = [];
  const y = [];
  Object.keys(data).forEach(time => {
    x.push(new Date(time * 1000));
    y.push(data[time].rank);
  });
  return { type: 'scatter', x, y, };
}

function graphStuff({ ranks = [], support = [], core = [] }) {
  Plotly.plot(gd, [makeTrace(ranks), makeTrace(support), makeTrace(core)], {
    title: 'Nukeydog\'s Rank (wow!)',
    font: {
      size: 16
    },
    yaxis: {
      // autorange: 'reversed',
      range: [1600, 0]
    }
  });
}

window.onresize = () => {
  Plotly.Plots.resize(gd);
};
