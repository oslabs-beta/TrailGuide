/**
 * bucket means defining how close two times have to be to be considered the 'same'
 *  The below function would 'bucket' times by hour by 'flooring' it to the nearest hour
 */

//return a new date object rather than mutating the original time argument. This will prevent accidental side effects 
//where other parts of your code may still need the unmodified date.

/**
 * Buckets time by the hour, flooring it to the nearest hour
 */
export function hour(time) {
  const newTime = new Date(time);
  newTime.setMilliseconds(0);
  newTime.setSeconds(0);
  newTime.setMinutes(0);
  return newTime;
}

/**
 * Buckets time by the day, flooring it to the start of the day (00:00)
 */
export function day(time) {
  const newTime = new Date(time);
  newTime.setMilliseconds(0);
  newTime.setSeconds(0);
  newTime.setMinutes(0);
  newTime.setHours(0);
  return newTime;
}

/**
 * Buckets time by the minute, flooring it to the nearest minute
 */
export function minute(time) {
  const newTime = new Date(time);
  newTime.setMilliseconds(0);
  newTime.setSeconds(0);
  return newTime;
}
