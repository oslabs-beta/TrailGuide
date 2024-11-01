import bcrypt from 'bcryptjs';
//bcrypt can both verify and hash the user passwords
import { query } from '../models/usersModel.js';

// signup user
export default {
  /**
   * Creates a new user in the database.
   *
   * This function handles user signup by validating the request data, hashing the password,
   * and inserting the user information into the database. If successful, it stores the created
   * user in `res.locals.createdUser` for further use in the middleware chain.
   *
   * Expected request body properties:
   * - `username`: The unique username of the new user.
   * - `password`: The plaintext password, which will be hashed before storage.
   * - `displayName`: The display name of the user.
   * - `work_email`: The user’s work email address.
   * - `workPhone`: The user’s work phone number.
   *
   * Error Handling:
   * - Responds with a 400 status code if any required field is missing.
   * - Responds with a 500 status code if there is a server error during the database operation.
   *
   * @param {Object} req - The request object containing the user data in `req.body`.
   * @param {Object} res - The response object to store `res.locals.createdUser`.
   * @param {Function} next - The next middleware function in the Express stack.
   */
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

  /**
   * Authenticates a user based on their email/username and password.
   *
   * This function verifies the user's credentials by checking if the provided
   * email/username and password match an existing user in the database.
   * If successful, the user information is stored in `res.locals.loggedinuser` for
   * further use in the middleware chain.
   *
   * Expected request body properties:
   * - `username`: The username of the user (optional if `work_email` is provided).
   * - `work_email`: The user's work email address (optional if `username` is provided).
   * - `password`: The plaintext password provided by the user, which is compared with the hashed password in the database.
   *
   * Edge Cases:
   * - If no matching user is found in the database, responds with a 400 status and a "User Does Not Exist" message.
   * - If the password does not match, responds with a 400 status and a "Login Unsuccessful" message.
   *
   * Error Handling:
   * - Responds with a 500 status code and logs the error if there is a server error during the database operation.
   *
   * @param {Object} req - The request object containing user login credentials in `req.body`.
   * @param {Object} res - The response object to store `res.locals.loggedinuser` on successful login.
   * @param {Function} next - The next middleware function in the Express stack.
   * @returns {void} - Calls the next middleware function in the chain.
   */
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
      return next({
        log: 'userController.loginUser: ' + err,
        status: 500,
        message: {
          err: 'Error during Login',
        },
      });
    }
  },
  /**
   * Updates a user's AWS credentials in the database.
   *
   * This function updates the specified user's AWS credentials in the `users` table,
   * including AWS access key, secret access key, and region. It expects the AWS credentials
   * to be provided in `res.locals.awsCredentials` and the username in `req.body.username`.
   *
   * Expected request body properties:
   * - `username`: The username of the user whose AWS credentials are being updated.
   *
   * Expected `res.locals` properties:
   * - `awsCredentials.aws_access_key`: The user's AWS access key.
   * - `awsCredentials.aws_secret_access_key`: The user's AWS secret access key.
   * - `awsCredentials.aws_region`: The AWS region associated with the user's credentials.
   *
   * Edge Cases:
   * - If `username` is not provided in `req.body`, responds with a 400 status and an error message.
   *
   * Error Handling:
   * - Responds with a 500 status code and logs the error if there is an issue updating the database.
   *
   * @param {Object} req - The request object, containing `username` in `req.body`.
   * @param {Object} res - The response object, where `res.locals.updatedUser` will store the updated user record.
   * @param {Function} next - The next middleware function in the Express stack.
   * @returns {void} - Calls the next middleware function in the chain.
   */
  saveUserAwsCredentials: async (req, res, next) => {
    if (!req.body.username)
      return next({
        log: 'userController.saveUserAWsCredentials: No username provided in request body',
        status: 400,
        message: {
          err: 'Malformed Request: include a username',
        },
      });
    try {
      const result = await query(
        `
        UPDATE users
        SET aws_access_key = $1,
            aws_secret_access_key = $2,
            aws_region = $3
        WHERE username = $4
        RETURNING *;
      `,
        [
          res.locals.awsCredentials.aws_access_key,
          res.locals.awsCredentials.aws_secret_access_key,
          res.locals.awsCredentials.aws_region,
          req.body.username,
        ]
      );
      res.locals.updatedUser = result.rows[0];
      return next();
    } catch (error) {
      return next({
        log: 'userController.saveUserAwsCredentials: ' + error,
        status: 500,
        message: {
          err: 'Error when saving credentials',
        },
      });
    }
  },
};
