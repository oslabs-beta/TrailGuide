import { CloudTrailClient } from '@aws-sdk/client-cloudtrail';

// Initialize AWS SDK v3 CloudTrail client
const cloudtrailClient = new CloudTrailClient({
  region: 'us-east-1', // replacing this with enviornment variable creates CORS issues?
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  },
});

export default cloudtrailClient;
