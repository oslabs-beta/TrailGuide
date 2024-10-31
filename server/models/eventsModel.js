import {
  CloudTrailClient,
  LookupEventsCommand,
} from '@aws-sdk/client-cloudtrail';
import pg from 'pg';
// import 'dotenv/config';

// TODO: USE ENVIRONMENT VARIABLES
const pool = new pg.Pool({
  user: 'tgadmin',
  password: 'secret',
  host:
    process.env.NODE_ENV === 'production'
      ? 'trailguide-db-prod'
      : 'trailguide-db-dev',
  port: 5432,
  database: process.env.POSTGRES_DB || 'tgdb-dev',
});

// if an error is encountered by a client while it sits idle in the pool
// the pool itself will emit an error event with both the error and
// the client which emitted the original error
// this is a rare occurrence but can happen if there is a network partition
// between your application and the database, the database restarts, etc.
// and so you might want to handle it and at least log it out
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

//export the query method for passing queries to the pool
export async function query(text, values) {
  // console.log(
  //   'eventsModel.query: ',
  //   text.split('\n')[1],
  //   ' with ',
  //   values?.length || 0,
  //   'values'
  // );
  return pool.query(text, values);
}

// the pool also supports checking out a client for
// multiple operations, such as a transaction
export async function connect() {
  return pool.connect();
}

let cloudtrailClient;

export function configureCloudtrailClient() {
  try {
    cloudtrailClient = new CloudTrailClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  } catch (error) {
    console.log(
      `Cannot create cloudtrail client with following credentials: Access Key: ${
        process.env.AWS_ACCESS_KEY_ID
      }, Region: ${
        process.env.AWS_REGION
      } Secret Access Key type: ${typeof process.env.AWS_SECRET_ACCESS_KEY}`
    );
  }
}

configureCloudtrailClient();

async function getLastEvent() {
  try {
    const result = await query(
      `
      SELECT time 
      FROM events 
      ORDER BY time DESC 
      LIMIT 1;
    `
    );
    if (result.rows.length === 0) return;
    return new Date(result.rows[0].time);
  } catch (error) {
    console.warn('Could not get last event!: ' + error);
  }
}

async function updateEvents(next, config = {}) {
  // if we haven't received all events from our last call
  //  continue receiving them
  //  otherwise, find the most recent event in the database,
  //  and get any events more recent than that

  if (
    !cloudtrailClient ||
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === '' ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY === '' ||
    !process.env.AWS_REGION ||
    process.env.AWS_REGION === ''
  ) {
    console.log('skipping event fetching because the keys are not set');
    return;
  }

  if (!next) {
    const startTime = await getLastEvent();
    if (startTime) config.StartTime = startTime;
  }
  let data;
  try {
    const command = new LookupEventsCommand(config);
    data = await cloudtrailClient.send(command);
  } catch (error) {
    console.error(
      'eventsModel.updateEvents: LookupEvents error:' + error.message
    );
    return;
  }
  if (!data) return;
  for (const event of data.Events) {
    const cloudtrailevent = JSON.parse(event.CloudTrailEvent);
    try {
      await query(
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
          user_agent
        ) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
         $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (_id)
        DO NOTHING;
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
          cloudtrailevent.tlsDetails?.cipherSuite || 'NULL',
          cloudtrailevent.tlsDetails?.clientProvidedHostHeader || 'NULL',
          cloudtrailevent.eventCategory,
          event.EventTime.toUTCString(),
          cloudtrailevent.eventType,
          cloudtrailevent.eventVersion,
          cloudtrailevent.managementEvent,
          cloudtrailevent.userIdentity.principalId,
          cloudtrailevent.recipientAccountId,
          cloudtrailevent.requestID,
          cloudtrailevent.sourceIPAddress,
          cloudtrailevent.tlsDetails?.tlsVersion || 'NULL',
          cloudtrailevent.userIdentity.type,
          cloudtrailevent.userAgent,
        ]
      );
    } catch (error) {
      console.warn('Could not insert cloudtrailevent: ', event.EventId);
    }
  }
  return { next: data.NextToken, config };
}

function repeatUpdate(next, config) {
  setTimeout(async () => {
    const { new_next, new_config } = updateEvents(next, config);
    repeatUpdate(new_next, new_config);
  }, 1000 * 10);
}
repeatUpdate();
