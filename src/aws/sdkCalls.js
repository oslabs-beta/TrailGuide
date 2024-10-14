import cloudtrailClient from './config/awsConfig.js';
import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';

export async function getLastFive() {
  try {
    const command = new LookupEventsCommand({ MaxResults: 5 });
    const data = await cloudtrailClient.send(command);
    res.json(data.Events);
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    res.status(500).json({ error: 'Failed to fetch CloudTrail events' });
  }
}
