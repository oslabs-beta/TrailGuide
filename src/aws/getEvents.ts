import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import cloudtrailClient from './awsClient';

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
