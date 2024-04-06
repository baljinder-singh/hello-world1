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
  console.log('error', error);
});


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// POST route handler
app.post('/', (req, res) => {
    // Log request query parameters
    console.log('Request Query Parameters:');
    console.log(req.query);

    // Log request body (parsed by bodyParser middleware)
    console.log('Request Body:');
    console.log(req.body);

    // Example: Set a value in Redis
    const key = 'rishav';
    const value = 'Navin';

    client.set(key, value, (err, reply) => {
        if (err) {
            console.error('Redis set error:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Redis set response:', reply);
        res.send('Hello World Duniya!'); // Send response to client
    });
});

app.get('/', (req, res) => {
  console.log('req.query in get');
  console.log(req.query);
  client.get('rishav', function (err, output) {
    console.log(output);
    console.log(err);
    res.send('Hello World Duniya!');
  });


});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
