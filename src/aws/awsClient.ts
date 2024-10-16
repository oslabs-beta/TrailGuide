import { CloudTrailClient } from '@aws-sdk/client-cloudtrail';

// Initialize the CloudTrail client using Vite's environment variables
const cloudtrailClient = new CloudTrailClient({
  region: import.meta.env.VITE_AWS_REGION as string,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  },
});

export default cloudtrailClient;
