import { CloudTrailClient } from '@aws-sdk/client-cloudtrail';
import dbPool from '../db/db';
import timeBuckets from '../utils/timeBuckets';

// Initialize the CloudTrail client using environment variables
try {
  const cloudtrailClient = new CloudTrailClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
} catch (error) {
  console.log(
    `Cannot sign create cloudtrail client with following credentials: Access Key: ${
      process.env.VITE_AWS_ACCESS_KEY_ID
    }, Region: ${
      process.env.AWS_REGION
    } Secret Access Key type: ${typeof process.env.AWS_SECRET_ACCESS_KEY}`
  );
}

async function createEventsTable() {
  try {
    const client = await dbPool.connect();
    await client.query(`
    CREATE TABLE IF NOT EXISTS events (
    _id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(30),
    source VARCHAR(30),
    read_only BOOLEAN,
    username VARCHAR(12),
    accesskey_id VARCHAR(20),
    account_id VARCHAR(15),
    arn VARCHAR(35),
    aws_region VARCHAR(10),
    cipher_suite VARCHAR(20),
    client_provided_host_header VARCHAR(35),
    category VARCHAR(20),
    time TIMESTAMPTZ,
    type VARCHAR(20),
    version VARCHAR(8),
    is_management BOOLEAN,
    principal_id VARCHAR(25),
    recipient_account_id VARCHAR(15),
    request_id VARCHAR(36),
    source_ip VARCHAR(15),
    tls_version VARCHAR(10),
    user_identity_type VARCHAR(12),
    user_agent VARCHAR(120)
    );
    `);
  } catch (error) {
    console.warn('Could not create events table: ' + error);
  }
  client.release();
}

async function getLastEvent() {
  try {
    const client = await dbPool.connect();
    const result = await client.query(`
    SELECT time 
    FROM events 
    ORDER BY time 
    DESC LIMIT 1;
    `);
    lastCalled = new Date(result.rows[0]);
  } catch (error) {
    console.warn('Could not get last event!: ' + error);
  }
}

let lastCalled;
createEventsTable();
getLastEvent;
let next;

async function updateEvents(events) {
  lastCalled = Date.now();
  const client = await dbPool.connect();
  const command = new LookupEventsCommand({
    StartTime: lastCalled,
    NextToken: next,
  });
  const data = await cloudtrailClient.send(command);

  for (const event of data.events) {
    const cloudtrailevent = JSON.parse(event.CloudTrailEvent);
    client.query(
      `
        INSERT INTO events (
          _id,
          name,
          source,
          read_only,
          username,
          accesskey_id,
          account_id,
          arn,
          aws_region,
          cipher_suite,
          client_provided_host_header,
          category,
          time,
          type,
          version,
          is_management,
          principal_id,
          recipient_account_id,
          request_id,
          source_ip,
          tls_version,
          user_identity_type,
          user_agent,
        ) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
         $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22);
    `,
      [
        event.EventId,
        event.EventName,
        event.EventSource,
        cloudtrailevent.readOnly,
        event.Username,
        event.AccessKeyId,
        cloudtrailevent.userIdentity.accountId,
        cloudtrailevent.userIdentity.arn,
        cloudtrailevent.awsRegion,
        cloudtrailevent.tlsDetails.cipherSuite,
        cloudtrailevent.tlsDetails.clientProvidedHostHeader,
        cloudtrailevent.eventCategory,
        event.EventTime.toString(),
        cloudtrailevent.eventType,
        cloudtrailevent.eventVersion,
        cloudtrailevent.managementEvent,
        cloudtrailevent.userIdentity.principalId,
        cloudtrailevent.recipientAccountId,
        cloudtrailevent.requestID,
        cloudtrailevent.sourceIPAddress,
        cloudtrailevent.tlsDetails.tlsVersion,
        cloudtrailevent.userIdentity.type,
        cloudtrailevent.userAgent,
      ]
    );
  }
  next = data.NextToken;
  client.release();
}

function repeatUpdate() {
  setTimeout(async () => {
    updateEvents();
    repeatUpdate();
  }, 1000 * 60);
}
repeatUpdate();

export default {
  getEvents: async (req, res, next) => {
    try {
      const client = await dbPool.connect();
      const result = await client.query(
        `
        SELECT * FROM events
        ORDER BY time DESC
        LIMIT $1 
        `,
        [req.query.amount || 50]
      );
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

  countOn: (req, res, next) => {
    if (!req.query.groupField) return next();
    try {
      if (req.query.groupField === 'time' && req.query.bucketterFunc) {
        const bucketterFunc = timeBuckets[req.query] || timeBuckets.minute;
        res.locals.forEach((event) => (event.time = bucketterFunc(event.time)));
      }
      const countsPerField = res.locals.events.reduce((counts, event) => ({
        ...counts,
        [event[req.query.groupField]]:
          (counts[event[req.query.groupField]] || 0) + 1,
      }));
      res.locals.events = Object.entries(countsPerField).map(
        ([group, count]) => ({
          count,
          [req.query.groupField]: group,
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
