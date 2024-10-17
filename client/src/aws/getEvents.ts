import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import cloudtrailClient from './awsClient';
import { UnparsedAWSEvent } from '../types';

// Function to get a specified number of CloudTrail events
export async function getEvents(amount = 50): Promise<UnparsedAWSEvent[]> {
  try {
    let grabbed = 0;
    const events = [];
    while (amount > grabbed) {
      const command = new LookupEventsCommand({ MaxResults: amount - grabbed });
      const data = await cloudtrailClient.send(command);
      if (!data.Events || !data.NextToken) break;
      grabbed += data.Events.length;
      events.push(...data.Events);
    }
    return events;
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    throw err; // Optional: rethrow to handle in the calling function
  }
}
