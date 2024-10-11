import { CloudTrailClient } from '@aws-sdk/client-cloudtrail';
import 'dotenv/config';

// Initialize AWS SDK v3 CloudTrail client
const cloudtrailClient = new CloudTrailClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default cloudtrailClient;
