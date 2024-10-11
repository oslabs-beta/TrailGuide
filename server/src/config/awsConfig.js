const { CloudTrailClient } = require('@aws-sdk/client-cloudtrail');
require('dotenv').config();

// Initialize AWS SDK v3 CloudTrail client
const cloudtrailClient = new CloudTrailClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = cloudtrailClient;