import { LookupEventsCommand } from '@aws-sdk/client-cloudtrail';
import cloudtrailClient from './awsClient';
import { CloudTrailEvent, FlattenedEvent, UnparsedAWSEvent } from '../types';

export async function getFlattenedEvents(
  amount = 50
): Promise<FlattenedEvent[]> {
  const command = new LookupEventsCommand({ MaxResults: amount });
  const response: { Events?: UnparsedAWSEvent[]; NextToken?: string } =
    await cloudtrailClient.send(command);

  // if we couldn't get anything return nothing (in the type of an array)
  if (!response.Events) return [];

  // recursive function to turn a nested object into a one-depth one
  function flattenObject(
    obj: object,
    namespace = new Set(),
    trace: string[] = []
  ): object {
    return Object.entries(obj).reduce((accum, [key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value))
        return {
          ...accum,
          ...flattenObject(value as object, namespace, trace.concat(key)),
        };
      else {
        let i = trace.length - 1;
        while (namespace.has(key) && i >= 0) key = trace[i--] + key;
        namespace.add(key);
        return { ...accum, [key]: value as unknown };
      }
    }, {});
  }
  // parse the actual cloudtrail events from the results
  return response.Events.map((event) => {
    if (!event.CloudTrailEvent) return {};
    return flattenObject({
      ...event,
      CloudTrailEvent: JSON.parse(event.CloudTrailEvent) as CloudTrailEvent,
    });
  });
}
