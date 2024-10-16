import { TimeCount } from '../types';
import { getFlattenedEvents } from './getFlattenedEvents';

/**
 * bucket means defining how close two times have to be to be considered the 'same'
 *  The below function would 'bucket' times by hour by 'flooring' it to the nearest hour
 */
export function bucketByHour(time: Date): Date {
  time.setMilliseconds(0);
  time.setSeconds(0);
  time.setMinutes(0);
  return time;
}

export function bucketByDay(time: Date): Date {
  time.setMilliseconds(0);
  time.setSeconds(0);
  time.setMinutes(0);
  time.setHours(0);
  return time;
}

export function bucketByMinute(time: Date): Date {
  time.setMilliseconds(0);
  time.setSeconds(0);
  return time;
}

export default async function (
  ip: string,
  // allows user to specifiy how discrete to make the buckets
  bucketerFn = bucketByHour,
  amount = 50
): Promise<TimeCount[]> {
  const events = (await getFlattenedEvents(amount)).filter((event) => {
    return event.sourceIPAddress && event.sourceIPAddress === ip;
  });

  // get a count of each time, and then reshape
  //  that object into a list of objects (one for each key value pair)
  return Object.entries(
    events.reduce((counts, event) => {
      // skip any event without an eventTime property
      if (!event.eventTime) return counts;
      // bucket the time using the paramater function
      const bucketedTime = bucketerFn(new Date(event.eventTime)).toUTCString();
      return {
        ...counts,
        [bucketedTime]: (counts[bucketedTime] || 0) + 1,
      };
    }, {} as Record<string, number>)
  ).map(([utcTimeStr, count]) => ({
    time: new Date(utcTimeStr),
    localTime: new Date(utcTimeStr).toLocaleTimeString(),
    count,
  }));
}
