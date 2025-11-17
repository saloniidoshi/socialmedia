// api/index.js
const serverless = require('serverless-http');
const app = require('../app'); // import the express app

module.exports = serverless(app);
