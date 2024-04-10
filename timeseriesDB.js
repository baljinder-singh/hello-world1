const {
  InfluxDBClient,
  Point
} = require('@influxdata/influxdb3-client');


const timeseriesClient = new InfluxDBClient({
  host: 'https://us-east-1-1.aws.cloud2.influxdata.com',
  token: process.env.token
});

let database = `testingtimeseriesdata`;

async function createTimeseriesDataPoint(dataArray) {
  try {
    // Initialize an empty array to hold all data points
    const points = [];

    // Iterate over each data object in the array
    for (const data of dataArray) {
      const measurementName = data.measurement || 'census'; // Default measurement name
      const tags = data.tags || {}; // Tags (e.g., location, area)
      const fields = data.fields || {}; // Fields (e.g., cost)

      // Create a new Point object for the data point
      const point = Point.measurement(measurementName);

      // Set tags for the data point
      for (const [tagName, tagValue] of Object.entries(tags)) {
        point.setTag(tagName, tagValue);
      }

      // Set fields for the data point (assuming all fields are integers)
      for (const [fieldName, fieldValue] of Object.entries(fields)) {
        point.setIntegerField(fieldName, fieldValue);
      }

      // Add the constructed point to the points array
      points.push(point);
    }

    // Write all data points to the timeseries database
    for (const point of points) {
      console.log(point.toLineProtocol()); // Log the data point in line protocol format

      // Write the data point to the timeseries database
      await timeseriesClient.write(point, database);
    }

  } catch (error) {
    console.error('Error creating timeseries data point:', error);
  }
}

async function fetchDataFromTimeseries(queryString) {
  console.log('Going to fetch data from timerseries database');
  let query = queryString || `SELECT * FROM selling1 WHERE customer = 'baljinder' AND time >= now() - interval '120 hour'`

  console.log('queryString');
  console.log(queryString);

  var data = [];

  var object = {};
  var key = 'key';
  var i = 0;

  try {
    // Execute the InfluxDB query and retrieve data
    const rows = await timeseriesClient.query(query, 'testingtimeseriesdata');

    // Iterate over the query result rows using a for-await-of loop
    for await (const row of rows) {
      i++;
      // Log each row object
      console.log('Row:', row);


      const time = new Date(row._time).toISOString(); // Convert time to ISO string

      data.push(row);
      object[key+i] = row;

      // Output the retrieved data
      console.log(`Total cost on ${time}: ${totalCost}`);
    }

    console.log('Query execution completed.');
    console.log('rows');
    console.log(rows);
    console.log('data');
    console.log(data);
    console.log('object');
    console.log(object);


    return rows;



  } catch (error) {
    console.error('Error executing timeseries query:', error);
  }


};


module.exports = {
  createTimeseriesDataPoint: createTimeseriesDataPoint,
  fetchDataFromTimeseries: fetchDataFromTimeseries
}
