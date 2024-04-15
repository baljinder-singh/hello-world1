// app.js
const express = require('express');
const cors = require('cors');
const Canvas = require('canvas'); // Required for jsbarcode
const bwipjs = require('bwip-js');


const timeseriesDB = require('./timeseriesDB.js');
const cacheDB = require('./cacheDB.js');
const getstream = require('./getstream.js');
const token = require('./token.js');
const baseapp = require('./baseapp.js');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// CORS configuration
const allowedOrigins = ['http://example1.com', 'http://example2.com']; // Specify your allowed origins here

/*const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
};*/

// CORS configuration
const corsOptions = {
  origin: '*' // Allow requests from any origin
};

app.use(cors(corsOptions)); // Enable CORS with custom options


app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  var key = 'signup';
  var field = username;
  var value = password;

  console.log('key, field');
  console.log(key, field);
  cacheDB.client.hget(key, field, (err, reply) => {
    console.log('reply');
    console.log(reply);
    console.log('err');
    console.log(err);
    if(reply) {
      res.status(401).send('user already exists');
      return;
    }
    cacheDB.client.hset(key, field, value, (err, reply) => {
      if (err) {
        console.error('Redis hset error:', err);
        return res.status(500).send('Internal Server Error');
      }
      // Example usage:

      console.log('Redis hset response:', reply);
      res.send({
        message: 'User Signed up suceessfully!'
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  cacheDB.client.hget(key, field, (err, reply) => {
    console.log('reply');
    console.log(reply);
    console.log('err');
    console.log(err);
    if(reply === password) {
      console.log(111111111111111);
      let genratedToken = token.generateToken();
      res.send({
        output: 'Found token!',
        token: genratedToken
      });

    }
    else {
      console.log(2222222222222222222);
      return res.status(401).send('Invalid username or password');
    }
  });
});

app.get('/protected-page', (req, res) => {
  // Access user data from req.user (if token is valid)
  res.send('Welcome, authorized user!');
});

app.get('/token', async (req, res) => {
  // Access user data from req.user (if token is valid)
  let genratedToken = token.generateToken();
  res.send({
    output: 'Found token!',
    token: genratedToken
  });
});



app.use(token.verifyToken);

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

  cacheDB.client.hset(key, field, value, (err, reply) => {
    if (err) {
      console.error('Redis hset error:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Example usage:
    const testData = {
        measurement: 'census',
        tags: { location: 'Klamath', area: 'india' },
        fields: { bees: 23 }
    };

    timeseriesDB.createTimeseriesDataPoint();

    console.log('Redis hset response:', reply);
    res.send({
      message: 'Data set in hashmap successfully!'
    });
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

  // Example: Set a value in Redis
  const key = req.query.userid + '-bill';
  const field = Math.floor(Math.random() * 10000000);
  const value = JSON.stringify(req.body);

  cacheDB.client.hset(key, field, value, (err, reply) => {
    if (err) {
      console.error('Redis hset error:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Redis hset response:', reply);
    res.send({
      message: 'Data set in hashmap successfully!'
    });
  });
});


// POST BILL route handler
app.post('/timeseries', (req, res) => {
  // Log request query parameters
  console.log('Request Query Parameters:');
  console.log(req.query);

  // Log request body (parsed by bodyParser middleware)
  console.log('Request Body:');
  console.log(req.body);


  // Example usage:

  let testData = [];

  for(let data of req.body) {
    let testDataPoint = {
      measurement: data.measureName,
      tags: data.tags,
      fields: { [data.measureField]: [data.measureValue] }
    };
    testData.push(testDataPoint);
  }

  try {
    timeseriesDB.createTimeseriesDataPoint(testData);
    res.send({
      message: 'Data set in timeseries successfully!'
    });
  }
  catch(e) {
    res.send({
      message: 'Data NOT set in timeseries!. Got Eroor',
      err: e
    });
  }
});

// POST feed data handler
app.post('/feed', async(req, res) => {
  // Log request query parameters
  console.log('Request Query Parameters:');
  console.log(req.query);

  // Log request body (parsed by bodyParser middleware)
  console.log('Request Body:');
  console.log(req.body);


  try {
    let output = await getstream.addActivity(req.query.userid, req.body);
    console.log(output);
    res.send({
      message: 'Data added successfully in feed'
    });
  }
  catch(e) {
    res.send({
      message: 'Data NOT set in feed!. Got Eroor',
      err: e
    });
  }
});



// GET route handler
app.get('/', (req, res) => {
  // Log request query parameters
  console.log('Request Query Parameters for get request:');
  console.log(req.query);

  // Example: Retrieve a value from Redis based on a key
  const key = req.query.userid;

  cacheDB.client.hgetall(key, (err, output) => {
    if (err) {
      console.error('Redis hget error:', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('Redis hget response:', output);

    if (output !== null) {
      res.send({
        output: output
      }); // Send the fetched value
    } else {
      res.send({
        output: 'Field not found in hashmap!'
      });
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

  cacheDB.client.hgetall(key, (err, output) => {
    if (err) {
      console.error('Redis hget error:', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('Redis hget response:', output);

    if (output !== null) {
      res.send({
        output: output
      }); // Send the fetched value
    } else {
      res.send({
        output: 'Field not found in hashmap!'
      });
    }
  });
});


app.get('/timeseries', async (req, res) => {
  try {
    const key = req.query.userid;

    // Fetch data from timeseriesDB
    const data = await timeseriesDB.fetchDataFromTimeseries(req.query.queryString);

    // Convert BigInt values to strings in the response data
    const serializedData = serializeData(data);

    console.log('Data fetched from timeseries database:', serializedData);
    res.send(serializedData);
  } catch (error) {
    console.error('Error fetching data from timeseries database:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST feed data handler
app.get('/feed', async(req, res) => {
  // Log request query parameters
  console.log('Request Query Parameters:');
  console.log(req.query);


  try {
    let output = await getstream.getActivity(req.query.userid, req.query.limit);
    res.send({
      message: output
    });
  }
  catch(e) {
    res.send({
      message: 'Data NOT set in feed!. Got Eroor',
      err: e
    });
  }
});


// Endpoint to generate barcode
app.get('/generateBarcode', (req, res) => {
  const {
    productId
  } = req.query;

  // Generate barcode using bwip-js
  bwipjs.toBuffer({
    bcid: 'code128', // Barcode type: code128 (or other supported types)
    text: productId, // Text to encode in the barcode
    scale: 3, // Scaling factor
    height: 10, // Height of the barcode (in mm)
    includetext: true, // Include human-readable text below the barcode
    textxalign: 'center' // Text alignment
  }, (err, png) => {
    if (err) {
      console.error('Barcode generation error:', err);
      res.status(500).send('Barcode generation error');
    } else {
      // Send the generated barcode image as base64 data
      const base64Data = Buffer.from(png).toString('base64');
      const imgSrc = `data:image/png;base64,${base64Data}`;
      res.send(imgSrc);
    }
  });
});



// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async() => {
  console.log(`Server is running on port ${PORT}`);
});


// Helper function to serialize data (handle BigInt values)
function serializeData(data) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // Convert BigInt values to strings
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value; // Return other values as is
  }));
}
