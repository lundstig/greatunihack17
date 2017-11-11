const express = require('express');
const app = express();

app.listen(3000, function() {
  console.log('Supercup server listening on port 3000');
});

app.get('/', function(req, res) {
  res.json({temp: 1000, sips: 42});
});
