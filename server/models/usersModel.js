// Importing pg (PostgreSQL) module to enable interaction with the database
import pg from 'pg';
// Importing dotenv configuration to load environment variables from .env file
import 'dotenv/config';

/**
 * Configures and creates a new PostgreSQL connection pool.
 * - Uses `pg.Pool` to manage multiple client connections to the database.
 * - Reads host, database, and other credentials based on the environment:
 *    - `host`: Uses 'trailguide-db-prod' in production and 'trailguide-db-dev' in development.
 *    - `database`: Reads from `POSTGRES_DB` environment variable, or defaults to 'tgdb-dev'.
 */
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

/**
 * Listens for errors on idle clients in the PostgreSQL connection pool.
 *
 * This event handler is triggered when a client in the pool encounters an error while idle,
 * which can help catch and log issues such as network problems or incorrect configurations
 * in the database connection setup.
 * Logs the error message and stack trace to aid in diagnosing and resolving issues.
 */
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

/**
 * Executes a parameterized SQL query on the PostgreSQL database.
 *
 * This function allows safe execution of SQL queries with dynamic parameters, leveraging
 * the connection pool to manage database connections efficiently.
 *
 * @param {string} text - The SQL query string, which may include placeholders (e.g., `$1`) for parameterized values.
 * @param {Array} values - An array of values to replace the placeholders in the SQL query, ensuring safe input handling.
 * @returns {Promise<Object>} - A promise that resolves with the query result object or rejects with an error if the query fails.
 *
 * @example
 * // Example usage of the query function
 * const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
 * console.log(result.rows); // Access rows from the result
 */
export async function query(text, values) {
  return pool.query(text, values);
}

/**
 * Retrieves a client connection from the PostgreSQL connection pool.
 *
 * Use this function to obtain a client for executing multiple SQL operations, such as
 * in a transaction. Ensure that you release the client back to the pool after completing
 * your operations to maintain efficient pool management.
 *
 * @returns {Promise<pg.PoolClient>} - A promise that resolves with a connected client instance
 * from the pool. The client should be released after use by calling `client.release()`.
 *
 * @example
 * // Example usage of the connect function for a transaction
 * const client = await connect();
 * try {
 *   await client.query('BEGIN');
 *   // Execute multiple queries
 *   await client.query('COMMIT');
 * } catch (error) {
 *   await client.query('ROLLBACK');
 *   throw error;
 * } finally {
 *   client.release(); // Always release the client back to the pool
 * }
 */
export async function connect() {
  return pool.connect();
}
