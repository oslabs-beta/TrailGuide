import cloudtrailClient from './awsClient';
import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';

import { IPAPIResponse, IpLocCount, UnparsedAWSEvent } from '../types';

export async function getIpCounts(): Promise<IpLocCount[]> {
  try {
    // pull the events from cloudtrail
    const command = new LookupEventsCommand({});
    const response: { Events?: UnparsedAWSEvent[]; NextToken?: string } =
      await cloudtrailClient.send(command);

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
      (counts: Record<string, number>, ip) => ({
        ...counts,
        [ip]: (counts[ip] || 0) + 1,
      }),

      {} // initial value of counts
    );
    // remove bad data
    delete ipCounts['not found'];
    // convert into array of objects for use with recharts
    return Promise.all(
      Object.entries(ipCounts).map(async ([ipAddress, count]) => {
        try {
          const response = await fetch(
            'https://ipapi.co/' + ipAddress + '/json'
          );
          const location = (await response.json()) as IPAPIResponse;
          return {
            name: location.ip,
            ip: location.ip,
            lat: location.latitude,
            long: location.longitude,
            country: location.country_name,
            region: location.region,
            city: location.city,
            count,
          };
        } catch (error) {
          console.log('Trouble getting data from ipapi.co: ', error);
          return {
            name: ipAddress,
            ip: ipAddress,
            lat: -1,
            long: -1,
            country: '',
            region: '',
            city: '',
            count,
          };
        }
      })
    );
  } catch (err) {
    console.error('Error fetching CloudTrail events', err);
    return [];
  }
}
