import { CloudTrailClient, LookupEventsCommand } from '@aws-sdk/client-cloudtrail';

// Initialize the CloudTrail client using Vite's environment variables
const cloudtrailClient = new CloudTrailClient({
  region: import.meta.env.VITE_AWS_REGION, // Ensure this is set in your .env file
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID, // Set this in your .env file
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY, // Set this in your .env file
  },
});

// Function to get the last five CloudTrail events
export async function getLastFive() {
  try {
    const command = new LookupEventsCommand({ MaxResults: 5 });
    const data = await cloudtrailClient.send(command);
    return data.Events;
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    throw err; // Optional: rethrow to handle in the calling function
  }
}

// Function to get a specified number of CloudTrail events
export async function getEvents(maxResults = 30) {
  try {
    const command = new LookupEventsCommand({ MaxResults: maxResults });
    const data = await cloudtrailClient.send(command);
    return data.Events;
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    throw err; // Optional: rethrow to handle in the calling function
  }
}
