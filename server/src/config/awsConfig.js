//It imports the aws-sdk package and loads environment variables (dotenv) for secure access keys.
import AWS from 'aws-sdk';
import 'dotenv/config';

//The AWS.config.update() method sets up the AWS credentials

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default AWS;
