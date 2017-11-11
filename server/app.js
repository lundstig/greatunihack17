const express = require('express');
const app = express();

var sips = [];
var temps = {};
var dipping = false;

// Parse POSTed data as json
app.use(express.json());

app.get('/', function(req, res) {
  res.send('<html><h1>Super cup</h1></html>');
});


app.get('/cup/temp', function(req, res) {
  res.json({temp: 9001, ts: Date.now()});
});

app.post('/cup/temp', function(req, res) {
  temps[Date.now()] = req.body.temp;
  res.end('ok');
  if (req.body.temp > 40) {
    dipping = true;
  } else {
    dipping = false;
  }
});


app.get('/cup/temp/history', function(req, res) {
  // Return data from last 10 minutes
  var now = Date.now();
  var duration = 10 * 60 * 1000;

  data = Object.keys(temps).filter(time => time > now - duration).
    reduce((ret, time) => {
      ret[time] = temps[time]
      return ret;
    }, {});
  
  res.json({temps: data});
});

app.get('/cup/temp/historytest', function(req, res) {
  res.json({
    history: {1: 70, 2: 78, 10: 60, 13: 55, 15: 50, 25: 45}
  });
});

app.get('/cup/sips/history', function(req, res) {
  // Return data from last 10 minutes
  var now = Date.now();
  var duration = 10 * 60 * 1000;
  res.json({
    sips: sips.filter(time => time > now - duration)
  });
});

app.get('/cup/sips/historytest', function(req, res) {
  res.json({timestamps: [1, 2, 3, 4, 5, 7, 9]});
});

app.post('/cup/sip', function(req, res) {
  sips.push(Date.now());
  res.end('ok');
});

app.get('/cup/commands', function(req, res) {
  res.json({dipping: dipping});
});

app.listen(3000, function() {
  console.log('Supercup server listening on port 3000');
});
