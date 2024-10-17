import pool from '../db/db.js';

async function setupDb() {
  const client = await pool.connect();
  await client.query(`
      CREATE TABLE IF NOT EXISTS test(
        _id SERIAL PRIMARY KEY,
        name VARCHAR(10) NOT NULL
      )
    `);
  client.release();
}

setupDb();
