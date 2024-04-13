const stream = require('getstream');

// instantiate a new client (server side)

let YOUR_API_KEY = process.env.YOUR_API_KEY;
let YOUR_API_SECRET = process.env.YOUR_API_SECRET;

const client = stream.connect(YOUR_API_KEY, YOUR_API_SECRET);

console.log('stream connected');

const userToken = client.createUserToken('chris');

async function addActivity(username, data) {
  let userFeed = client.feed('user', username);

  let activityObj = {
      actor: data.actor,
      verb: data.verb,
      object: data.object,
      message: data.message
  };

  if(data.foreign_id) { activityObj.foreign_id = data.foreign_id; }

  var response = await userFeed.addActivity(activityObj);
  return response;
}


async function getActivity(username, limit) {
  let userFeed = client.feed('user', username);


  // Read Jack's timeline and Chris' post appears in the feed:
  const results = await userFeed.get({ limit: limit || 10 });

  console.log('results');
  console.log(results);
  return results;

}

module.exports = {
  addActivity: addActivity,
  getActivity: getActivity
};
