import pg from 'pg';

export default new pg.Pool({
  user: 'root',
  password: 'secret',
  host: 'localhost',
  port: 5432,
  database: 'root',
});
