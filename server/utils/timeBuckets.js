/**
 * bucket means defining how close two times have to be to be considered the 'same'
 *  The below function would 'bucket' times by hour by 'flooring' it to the nearest hour
 */
export function hour(time) {
  time.setMilliseconds(0);
  time.setSeconds(0);
  time.setMinutes(0);
  return time;
}

export function day(time) {
  time.setMilliseconds(0);
  time.setSeconds(0);
  time.setMinutes(0);
  time.setHours(0);
  return time;
}

export function minute(time) {
  time.setMilliseconds(0);
  time.setSeconds(0);
  return time;
}
