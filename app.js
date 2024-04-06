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
    const key = req.query.key;
    const value = req.query.value;

    client.set(key, value, (err, reply) => {
        if (err) {
            console.error('Redis set error:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Redis set response:', reply);
        res.send({message: 'Hello World Duniya!'}); // Send response to client
    });
});

// GET route handler
app.get('/', (req, res) => {
    // Log request query parameters
    console.log('Request Query Parameters for get request:');
    console.log(req.query);

    // Example: Retrieve a value from Redis based on a key
    const key = req.query.key;

    client.get(key, (err, output) => {
        if (err) {
            console.error('Redis get error:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log('Redis get response:', output);

        // Check if value exists in Redis
        if (output !== null) {
            // Value found in Redis, send it as part of the response
            res.send(`Hello World Duniya! Redis Value: ${output}`);
        } else {
            // Value not found in Redis
            res.send({output: output});
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
