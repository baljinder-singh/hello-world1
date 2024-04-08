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
      const point = new Point(measurementName);

      // Set tags for the data point
      for (const [tagName, tagValue] of Object.entries(tags)) {
        point.tag(tagName, tagValue);
      }

      // Set fields for the data point (assuming all fields are integers)
      for (const [fieldName, fieldValue] of Object.entries(fields)) {
        point.intField(fieldName, fieldValue);
      }

      // Add the constructed point to the points array
      points.push(point);
    }

    // Write all data points to the timeseries database
    for (const point of points) {
      console.log('Writing data point:');
      console.log(point.toLineProtocol()); // Log the data point in line protocol format

      // Write the data point to the timeseries database
      await timeseriesClient.write(point, database);
      console.log('Data point written successfully');
    }

  } catch (error) {
    console.error('Error creating timeseries data point:', error);
  }
}

async function fetchDataFromTimeseries() {
  const query = `SELECT SUM(cost) AS total_cost
    FROM selling1
    WHERE time >= now() - 30d AND
          "customer" = 'baljinder'
    GROUP BY time(1d)
`


  const rows = await timeseriesClient.query(query, 'testingtimeseriesdata');

  for await (const row of rows) {
    console.log('row');
    console.log(row);

  }
};


module.exports = {
  createTimeseriesDataPoint: createTimeseriesDataPoint,
  fetchDataFromTimeseries: fetchDataFromTimeseries
}
