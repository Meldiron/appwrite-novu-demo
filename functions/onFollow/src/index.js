const sdk = require("node-appwrite");
const { Novu } = require("@novu/node");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'env' - object with environment variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();
  let database = new sdk.Database(client);
  let user = new sdk.Users(client);

  const novu = new Novu(req.env['NOVU_API_KEY']);

  client
    .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.env['APPWRITE_FUNCTION_API_KEY']);

  const data = JSON.parse(req.env.APPWRITE_FUNCTION_EVENT_DATA);

  const followBy = await database.getDocument("profiles", data.followBy);
  const followTo = await database.getDocument("profiles", data.followTo);

  const followToUser = await user.get(data.followTo);

  const novuResponse = await novu.trigger('newfollower', {
    to: {
      subscriberId: followToUser.$id,
      email: followToUser.email
    },
    payload: {
      'name': followBy.nickname,
    }
  });

  res.json(novuResponse.data);
};
