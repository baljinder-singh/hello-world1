// app.js
const express = require('express');
const cors = require('cors');
var redis = require('redis');
const Canvas = require('canvas'); // Required for jsbarcode
const jsBarcode = require('jsbarcode');

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
    const key = req.query.userid;
    const field = req.body.id;
    const value = JSON.stringify(req.body);

    client.hset(key, field, value, (err, reply) => {
    if (err) {
      console.error('Redis hset error:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Redis hset response:', reply);
    res.send({ message: 'Data set in hashmap successfully!' });
  });
});

// POST BILL route handler
app.post('/bill', (req, res) => {
    // Log request query parameters
    console.log('Request Query Parameters:');
    console.log(req.query);

    // Log request body (parsed by bodyParser middleware)
    console.log('Request Body:');
    console.log(req.body);

  var random number =
    // Example: Set a value in Redis
    const key = req.query.userid + '-bill';
    const field = Math.floor(Math.random()*10000000);
    const value = JSON.stringify(req.body);

    client.hset(key, field, value, (err, reply) => {
    if (err) {
      console.error('Redis hset error:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Redis hset response:', reply);
    res.send({ message: 'Data set in hashmap successfully!' });
  });
});

// GET route handler
app.get('/', (req, res) => {
    // Log request query parameters
    console.log('Request Query Parameters for get request:');
    console.log(req.query);

    // Example: Retrieve a value from Redis based on a key
    const key = req.query.userid;

    client.hgetall(key, (err, output) => {
      if (err) {
        console.error('Redis hget error:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('Redis hget response:', output);

      if (output !== null) {
        res.send({ output: output }); // Send the fetched value
      } else {
        res.send({ output: 'Field not found in hashmap!' });
      }
    });
});


// GET route handler
app.get('/bill', (req, res) => {
    // Log request query parameters
    console.log('Request Query Parameters for get request:');
    console.log(req.query);

    // Example: Retrieve a value from Redis based on a key
    const key = req.query.userid + '-bill';

    client.hgetall(key, (err, output) => {
      if (err) {
        console.error('Redis hget error:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('Redis hget response:', output);

      if (output !== null) {
        res.send({ output: output }); // Send the fetched value
      } else {
        res.send({ output: 'Field not found in hashmap!' });
      }
    });
});

app.get('/barcode/:productId', (req, res) => {
  const productId = req.params.productId;

  // Generate a canvas element
  const canvas = new Canvas(200, 50); // Adjust width and height as needed
  const ctx = canvas.getContext('2d');

  // Generate the barcode with jsbarcode
  jsBarcode(canvas, productId);

  // Send the barcode image as a response
  const buffer = canvas.toBuffer('image/png');
  res.contentType('image/png');
  res.send(buffer);
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
