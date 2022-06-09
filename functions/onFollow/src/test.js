require("dotenv").config();

const Function = require("./index");

Function({
  env: {
    ...process.env,
    APPWRITE_FUNCTION_EVENT_DATA: JSON.stringify({
      followBy: "62a2398811715ffed356",
      followTo: "62a23148117b8ac2764b"
    })
  }
}, {
  json: (msg) => {
    console.log(msg);
  }
}).catch((err) => { console.error(err); })