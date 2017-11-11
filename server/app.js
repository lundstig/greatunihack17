const express = require('express');
const app = express();

// Parse POSTed data as json
app.use(express.json());

app.listen(3000, function() {
  console.log('Supercup server listening on port 3000');
});

app.get('/', function(req, res) {
  res.send('<html><h1>Super cup</h1></html>');
});


app.get('/cup/temp', function(req, res) {
  res.json({temp: 1000, ts: Date.now()});
});

app.post('/cup/temp', function(req, res) {
  console.log('New temp is ' + req.body.temp);
  res.end('ok');
});

app.get('/cup/temp/history', function(req, res) {
  res.json({
    history: {1: 70, 2: 78, 10: 60, 13: 55, 15: 50, 25: 45}
  });
});

app.get('/cup/sips', function(req, res) {
  res.json({timestamps: [1, 2, 3, 4, 5, 7, 9]});
});

app.post('/cup/sip', function(req, res) {
  console.log('You sipped!');
  res.end('ok');
});
