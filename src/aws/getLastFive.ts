import cloudtrailClient from './awsClient';
import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';

import { IPAPIResponse, IpLocCount } from '../types';

export async function getLastFive() {
  try {
    const command = new LookupEventsCommand({ MaxResults: 5 });
    const data = await cloudtrailClient.send(command);
    return data.Events;
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
  }
}

export async function getIpCounts(): Promise<IpLocCount[]> {
  try {
    // pull the events from cloudtrail
    const command = new LookupEventsCommand({});
    const response = await cloudtrailClient.send(command);

    // if we couldn't get anything return nothing (in the type of an array)
    if (!response.Events) return [];

    // parse the actual cloudtrail events from the results
    // extract the ips as strings
    const ips: string[] = response.Events.map((event) => {
      if (event.CloudTrailEvent === undefined) return 'not found';
      return (JSON.parse(event.CloudTrailEvent) as { sourceIPAddress: string })
        .sourceIPAddress;
    });

    // accumulate a list of ip addresses into an object where the keys are ipAddress strings, and the values are
    //  the count of how often they showed up in the list
    const ipCounts: Record<string, number> = ips.reduce(
      (counts: Record<string, number>, ipAddress: string) => ({
        ...counts,
        [ipAddress]: (counts[ipAddress] || 0) + 1,
      }),

      {} // initial value of counts
    );
    // remove bad data
    delete ipCounts['not found'];
    // convert into array of objects for use with recharts
    return Promise.all(
      Object.entries(ipCounts).map(async ([ipAddress, count]) => {
        const response = await fetch('https://ipapi.co/' + ipAddress + '/json');
        const location = (await response.json()) as IPAPIResponse;
        return {
          ip: location.ip,
          lat: location.latitude,
          long: location.longitude,
          country: location.country_name,
          region: location.region,
          city: location.city,
          count,
        };
      })
    );
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    return [];
  }
}
