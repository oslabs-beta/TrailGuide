import bcrypt from 'bcryptjs';
//bcrypt can both verify and hash the user passwords
import { query } from '../models/usersModel.js';

// signup user
export default {
  createUser: async (req, res, next) => {
    const { username, password, displayName, work_email, workPhone } = req.body;

    //format validation
    if (!username || !password || !displayName || !work_email || !workPhone) {
      return next({
        log: 'userController.createUser: malformat request',
        status: 400,
        message: {
          err: 'Malformat request',
        },
      });
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
      const result = await query(queryText, values);
      res.locals.createdUser = result.rows[0];
      return next();
    } catch (err) {
      next({
        log: 'userController.createUser: ' + err,
        status: 500,
        message: {
          err: 'Error during user creation',
        },
      });
    }
  },

  //login user
  loginUser: async (req, res, next) => {
    const { username, work_email, password } = req.body;
    try {
      const queryText =
        'select * from users where work_email = $1 OR username = $2';
      const result = await query(queryText, [work_email, username]);

      //edge case 1: when the user does not exist
      if (result.rows.length === 0) {
        return next({
          log: 'userController.loginUser: User Does Not Exist in the database',
          status: 400,
          message: {
            err: 'Login Unseccessful',
          },
        });
      }

      const user = result.rows[0];

      //edge case 2: when the password is wrong
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next({
          log: 'userController.loginUser: user does not exist',
          status: 400,
          message: {
            err: 'Error during Login',
          },
        });
      }
      //return a response when login successfully
      res.locals.loggedinuser = user;
      return next();
    } catch (err) {
      next({
        log: 'userController.loginUser: ' + err,
        status: 500,
        message: {
          err: 'Error during Login',
        },
      });
    }
  },
};

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
// };

//example
//getUserByField('username', 'someUsername');
//getUserByField('work_email', 'someWorkEmail@example.com');
