const { InfluxDBClient, Point } = require('@influxdata/influxdb3-client');


const timeseriesClient = new InfluxDBClient({
  host: 'https://us-east-1-1.aws.cloud2.influxdata.com',
  token: token
});

let database = `testingtimeseriesdata`;

async function createTimeseriesDataPoint() {
  console.log('Going to create influx timeseries connection');

  try {
    const points = [
            Point.measurement("census")
            .setTag("location", "Klamath")
            .setTag("area", "india")
            .setIntegerField("bees", 23)
        ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      console.log('point');
      console.log(point);
      await timeseriesClient.write(point, database)
        .then(function () {
          console.log('Data wrote successfully');
          new Promise(resolve => setTimeout(resolve, 1000))
        });
    }

  } catch (e) {
    console.log('Got error while creating timeseries connection');
    console.log(e);
  }
};


async function fetchDataFromTimeseries() {
  const query = `SELECT * FROM 'census'
WHERE time >= now() - interval '24 hours' AND
('bees' IS NOT NULL OR 'ants' IS NOT NULL) order by time asc`

  const rows = await timeseriesClient.query(query, 'testingtimeseriesdata');

  console.log(`${"ants".padEnd(15)}${"bees".padEnd(15)}${"location".padEnd(30)}${"time".padEnd(45)}`);
  for await (const row of rows) {
    let ants = row.ants || '';
    let bees = row.bees || '';
    let time = new Date(row.time);
    console.log(`${ants.toString().padEnd(15)}${bees.toString().padEnd(15)}${row.location.padEnd(30)}${time.toString().padEnd(45)}`);
  }
};


module.exports = {
  createTimeseriesDataPoint: createTimeseriesDataPoint,
  fetchDataFromTimeseries: fetchDataFromTimeseries
}
