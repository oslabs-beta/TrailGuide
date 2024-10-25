import pool from '../db/db.js';
import bcrypt from 'bcryptjs';
//bcrypt can both verify and hash the user passwords

export async function setupDb() {
  try {
    await pool.query(`
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
  } catch (err) {
    console.error('Error setting up the database:', err);
  }
}

// signup user
export default {
  createUser: async (req, res, next) => {
    const { username, password, displayName, work_email, workPhone } = req.body;

    //format validation
    if (!username || !password || !displayName || !work_email || !workPhone) {
      return res.status(400).json({ error: 'Please fill all fields required' });
    }

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
      const result = await pool.query(queryText, values);
      res.status(201).json(result.rows[0]); //created users, parsed the result to json
    } catch (err) {
      next(err);
    }
  },

  //login user
  loginUser: async (req, res, next) => {
    const { work_email, password } = req.body;
    try {
      const queryText = 'select * from users where work_email = $1';
      const result = await pool.query(queryText, [work_email]);

      //edge case 1: when the user does not exist
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'user does not exist' }); //bad request
      }

      const user = result.rows[0];

      //edge case 2: when the password is wrong
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'login unsuccessful' }); //bad request
      }
      //return a response when login successfully
      res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
      next(err);
    }
  },

  // getAllUsers: async (req, res, next) => {
  //   try {
  //     const queryText = 'SELECT * FROM users;';
  //     const result = await pool.query(queryText);
  //     if (result.rows.length === 0) {
  //       return res.status(404).json({ error: `No User found` });
  //     }
  //     res.status(200).json(result.rows);
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  // getUserByField: async (req, res, next) => {
  //   const { field, value } = req.query; //used to be req.params
  //   try {
  //     const queryText = `SELECT * FROM users WHERE ${field} = $1;`;
  //     const result = await pool.query(queryText, [value]);
  //     return res.status(200).json(result.rows[0]);
  //   } catch (err) {
  //     next(err);
  //   }
  // },
};

//example
//getUserByField('username', 'someUsername');
//getUserByField('work_email', 'someWorkEmail@example.com');
