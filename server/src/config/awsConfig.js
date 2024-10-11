//It imports the aws-sdk package and loads environment variables (dotenv) for secure access keys.

//imports the aws-sdk package
const AWS = require('aws-sdk');

require('dotenv').config();

//console.log(process.env.AWS_ACCESS_KEY_ID);

//The AWS.config.update() method sets up the AWS credentials

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

//exports the AWS object from the file (awsconfig.js) so that other files can use it.
module.exports = AWS;
