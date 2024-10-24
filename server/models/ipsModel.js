import pg from 'pg';
import 'dotenv/config';

// TODO: USE ENVIRONMENT VARIABLES
const pool = new pg.Pool({
  user: 'tgadmin',
  password: 'secret',
  host: 'db',
  port: 5432,
  database: 'tgdb',
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
  console.log('query:', text.split('\n')[1], values);
  return pool.query(text, values);
}

// the pool also supports checking out a client for
// multiple operations, such as a transaction
export async function connect() {
  return pool.connect();
}
