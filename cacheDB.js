
var redis = require('redis');

var client = redis.createClient('13207', 'redis-13207.c241.us-east-1-4.ec2.redns.redis-cloud.com');

client.auth('TcGmbfefJrRMezO3i6wVilU4BDNKRTWL', function (err) {
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

module.exports = {
  client: client
};

