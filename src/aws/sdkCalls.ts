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

// export async function getIps() {
//   try {
//     const command = new LookupEventsCommand({});
//     const data = await cloudtrailClient.send(command);
//     const ctEvents = data.Events?.map(( event ) =>
//       JSON.parse(event.CloudTrailEvent || "{}");
//     );
//     console.dir(ctEvents[0]);
//     return;
//   } catch (err) {
//     console.error('Error fetching CloudTrail events', err);
//   }
// }
