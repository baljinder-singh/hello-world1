const stream = require('getstream');

// instantiate a new client (server side)

let YOUR_API_KEY = process.env.YOUR_API_KEY;
let YOUR_API_SECRET = process.env.YOUR_API_SECRET;

console.log('YOUR_API_KEY');
console.log(YOUR_API_KEY);
console.log('YOUR_API_SECRET');
console.log(YOUR_API_SECRET);


const client = stream.connect(YOUR_API_KEY, YOUR_API_SECRET);

console.log('stream connected');

const userToken = client.createUserToken('chris');

async function addActivity() {
  let chris = client.feed('user', 'chris');

  // Add an Activity; message is a custom field - tip: you can add unlimited custom fields!
  await chris.addActivity({
      actor: 'chris',
      verb: 'add',
      object: 'picture:10',
      foreign_id: 'picture:10',
      message: 'Beautiful bird!'
  });
}


async function getActivity() {

  let chris = client.feed('user', 'chris');


  // Read Jack's timeline and Chris' post appears in the feed:
  const results = await chris.get({ limit: 10 });

  console.log('results');
  console.log(results);

}

module.exports = {
  addActivity: addActivity,
  getActivity: getActivity
}
