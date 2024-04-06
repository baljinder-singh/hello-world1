// app.js
const express = require('express');
const cors = require('cors');
var redis = require('redis');

const app = express();

var client = redis.createClient('12611', 'redis-12611.c1.us-west-2-2.ec2.cloud.redislabs.com');

client.auth('qWj1TjnQ649eEHajzsfFmYO3yIIDDDIS', function (err) {
  if (err) {
    console.log('err');
  }
});

client.on('connect', function () {
  console.log("connected");
});

client.on('error', function (error) {
  console.log("error", error);
});


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Routes
app.get('/setData', (req, res) => {
  console.log('req.query');
  console.log(req.query);
  setDataInCache();
  res.send('Hello World Duniya!');

});

app.get('/getData', (req, res) => {
  console.log('req.query');
  console.log(req.query);
  getDataFromCache();
  res.send('Hello World Duniya!');

});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


function setDataInCache() {
  client.set('rishav', 'Navin', function (err, res) {
    console.log(res);
    console.log(err);
  });
}

function getDataFromCache(client) {
  client.get('rishav', function (err, res) {
    console.log(res);
    console.log(err);
  });
}
