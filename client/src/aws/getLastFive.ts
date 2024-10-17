import cloudtrailClient from './awsClient';
import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';

export async function getLastFive() {
  try {
    const command = new LookupEventsCommand({ MaxResults: 5 });
    const data = await cloudtrailClient.send(command);
    return data.Events;
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
  }
}
