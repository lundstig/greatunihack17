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

app.get('/cup/sip', function(req, res) {
  res.json({something: yes});
});

app.post('/cup/sip', function(req, res) {
  console.log('You sipped!');
  res.end('ok');
});
