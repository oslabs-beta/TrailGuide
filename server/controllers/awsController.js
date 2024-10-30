import * as timeBuckets from '../utils/timeBuckets.js';
import { configureCloudtrailClient, query } from '../models/eventsModel.js';

export default {
  setCredentials: (req, res, next) => {
    try {
      const { aws_access_key, aws_secret_access_key, aws_region } = req.body;
      if (!aws_access_key || !aws_secret_access_key || !aws_region) {
        console.log(req.body);
        return next({
          log: `awsController.setCredentials: Malformed Request: aws_access_key= ${aws_access_key} typeof aws_secret_access_key= ${typeof aws_secret_access_key} aws_region= ${aws_region}`,
          status: 400,
          message: { err: 'Malformed Request' },
        });
      }
      process.env.AWS_ACCESS_KEY_ID = aws_access_key;
      process.env.AWS_SECRET_ACCESS_KEY = aws_secret_access_key;
      process.env.AWS_aws_region = aws_region;
      configureCloudtrailClient();
      res.locals.awsCredentials = {
        aws_access_key,
        aws_secret_access_key,
        aws_region,
      };
      return next();
    } catch (error) {
      return next({
        log: 'awsController.setCredentials: ' + error,
        status: 500,
        message: {
          err: 'A server error occured',
        },
      });
    }
  },

  getEvents: async (req, res, next) => {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID === '' ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY_ID === '' ||
      !process.env.AWS_aws_region ||
      process.env.AWS_aws_region === ''
    ) {
      return next({
        log: 'awsController.getEvents: trying to get events without an accesskey',
        status: 403,
        message: {
          err: 'AWS Credentials not Authorized',
        },
      });
    }
    try {
      const result = await query(
        `
        SELECT * FROM events
        WHERE name != 'LookupEvents'
        ORDER BY time DESC
        LIMIT $1 
        `,
        [req.query.amount || 100]
      );
      // console.log('awsController.getEvents: got rows from db:', result.rows);
      res.locals.events = result.rows;
      return next();
    } catch (err) {
      return next({
        log: 'awsController.getEvents: ' + err,
        status: 500,
        message: {
          err: 'A server error occured',
        },
      });
    }
  },

  /**
   * Middleware to convert the array of events (res.locals.events) down to distinct groups, with a count of
   *  number of events for each.
   *  the '?countOn=' query string parameter specifies the event property to get distinct events by
   *    if no countOn query string parameter given, the function will not mutate the events array
   *  the '?groupTimeBy=' optional query string parameter specifies how to bucket time values.
   *    ( groupTimeBy=hour (minute is default) would count events with the same hour as the same event, giving a count per hour)
   * @param {*} req express middleware request object
   * @param {*} res express middleware response object
   * @param {*} next express middleware next function
   * @returns (all changes are made on the res.locals.events array) events array will be an array of objects of general type {countOn key : distinct value, count: number}
   */
  countOn: (req, res, next) => {
    // error checking for early exit if needed data doesn't exist
    if (
      !req.query.countOn ||
      !res.locals.events ||
      !Array.isArray(res.locals.events) ||
      res.locals.events.length === 0
    )
      return next();
    try {
      // bucket events (stored in res.locals.events) by user specified
      //  'groupByTime' function, or by minute as default
      if (req.query.countOn === 'time' && req.query.groupTimeBy) {
        const groupTimeBy =
          timeBuckets[req.query.groupTimeBy] || timeBuckets.minute;
        res.locals.events.forEach(
          (event) => (event.time = groupTimeBy(event.time))
        );
      }

      // reduce the events array into a single object where each key is a distint
      //  value of the event propertywe want to 'countOn',
      //  each value of this 'countsPerField' object is the number of events with that distinct key
      const countsPerField = res.locals.events.reduce(
        (counts, event) => ({
          ...counts,
          [event[req.query.countOn]]:
            (counts[event[req.query.countOn]] || 0) + 1,
        }),
        {} // start with an empty counts object
      );

      // convert the object back into an array of objects useable by our charts
      res.locals.events = Object.entries(countsPerField).map(
        ([group, count]) => ({
          count,
          name: group,
          [req.query.countOn]: group,
        })
      );

      return next();
    } catch (error) {
      return next({
        log: 'awsController.groupOn: ' + err,
        status: 500,
        message: {
          err: 'A server error occured',
        },
      });
    }
  },
};
