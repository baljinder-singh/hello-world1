// app.js
const express = require('express');
const cors = require('cors');
var redis = require('redis');

const app = express();


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Routes
app.get('/', (req, res) => {
  cacheClient();
  client.get('rishav', function (err, output) {
    res.send('Hello World!', output );
    console.log(res);
    console.log(err);
  });

});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


function cacheClient() {
  var client = redis.createClient('6379', 'redis://red-co8cu4gl5elc738sqsf0');

  client.on('connect', function () {
    console.log("connected");
  });

  client.on('error', function (error) {
    console.log("error", error);
  });


  client.set('rishav', 'Navin', function (err, res) {
    console.log(res);
    console.log(err);
  });

  client.get('rishav', function (err, res) {
    console.log(res);
    console.log(err);
  });

  return client;
}
