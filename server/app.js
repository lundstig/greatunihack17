const express = require('express');
const app = express();
const LastN = 5;

var sips = [];
var temps = [];
var lastNtemps=[];
var dipping = false;

Array.prototype.simpleSMA = function(N) {
  return this.map(function(x, i, v) {
    if (i < N - 1) return NaN;
    return v.filter(function(x2, i2) {
      return i2 <= i && i2 > i - N;
    }).reduce(function(a, b) {
      return a + b;
    }) / N;
  });
};


function movingAverage(data,N){
  var dates = [];
  var temps = [];
  data.forEach(obj=>{
    dates.push(obj[0]);
    temps.push(obj[1]);
    
  })
  var res = [];
  
  tempsAvg = temps.simpleSMA(N);

  tempsAvg.forEach((val, i)=>{
    if(isNaN(val)){
      return;
      res.push([dates[i],temps[i]])
    } else {
      res.push([dates[i],val])
    }
  });

  return res
  
}

// Parse POSTed data as json
app.use(express.json());

// Allow access to website
app.use(express.static('../client'))

app.get('/cup/temp', function(req, res) {
  res.json({temp: 9001, ts: Date.now()});
});

app.post('/cup/temp', function(req, res) {
  temps.push([Date.now(), req.body.temp]);
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

  var data = temps.filter(time => time[0] > now - duration);
  //data = data.map(el=>return [el[0]])
  data = movingAverage(data,LastN);

  res.json(data);
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
