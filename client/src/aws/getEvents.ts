import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import cloudtrailClient from './awsClient';
import { UnparsedAWSEvent } from '../types';

// Function to get a specified number of CloudTrail events
export async function getEvents(maxResults = 30): Promise<UnparsedAWSEvent[]> {
  try {
    const command = new LookupEventsCommand({ MaxResults: maxResults });
    const data = await cloudtrailClient.send(command);
    if (!data.Events) return [];
    return data.Events;
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    throw err; // Optional: rethrow to handle in the calling function
  }
}
