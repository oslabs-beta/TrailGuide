import pool from '../db/db.js';
import bcrypt from 'bcryptjs';
//bcrypt can both verify and hash the user passwords

export async function setupDb() {
  const client = await pool.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS users(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      display_name VARCHAR(100),
      work_email VARCHAR(255) UNIQUE NOT NULL,
      work_phone VARCHAR(25),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
    `);
  client.release();
}

// signup user
export default {
  createUser: async (req, res) => {
    const { username, password, displayName, work_email, workPhone } = req.body;
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(password, 10); //salt = 10

      const queryText = `
      INSERT INTO users (username, password, display_name, work_email, work_phone)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
      //values will replaced the placeholder above
      const values = [
        username,
        hashedPassword,
        displayName,
        work_email,
        workPhone,
      ];
      const result = await client.query(queryText, values);
      res.status(201).json(result.rows[0]); //created users, parsed the result to json
    } catch (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Error creating user' });
    } finally {
      client.release();
    }
  },

  //login user
  loginUser: async (req, res) => {
    const { work_email, password } = req.body;
    const client = await pool.connect();
    try {
      const queryText = 'select * from users where work_email = $1';
      const result = await client.query(queryText, [work_email]);

      //edge case 1: when the user does not exist
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'user does not exist' }); //bad request
      }

      const user = result.rows[0];

      //edge case 2: when the password is wrong
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'user password is not correct' }); //bad request
      }
    } catch (err) {
      console.error('error logging in user', err);
      res
        .status(500)
        .json({ error: 'login error in server (userController page)' });
    } finally {
      client.release();
    }
  },

  getAllUsers: async (req, res) => {
    const client = await pool.connect();
    try {
      const queryText = 'SELECT * FROM users;';
      const result = await client.query(queryText);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      client.release();
    }
  },

  getUserByField: async (req, res) => {
    const { field, value } = req.query; //used to be req.params
    const client = await pool.connect();
    try {
      const queryText = `SELECT * FROM users WHERE ${field} = $1;`;
      const result = await client.query(queryText, [value]);
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(`Error fetching user by ${field}:`, err);
    } finally {
      client.release();
    }
  },
};

//example
//getUserByField('username', 'someUsername');
//getUserByField('work_email', 'someWorkEmail@example.com');

//export default userController;
