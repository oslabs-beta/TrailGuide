import express from 'express';
import ViteExpress from 'vite-express';
import userController from './controllers/userController.js';
import awsController from './controllers/awsController.js';
import ipLocController from './controllers/ipLocController.js';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for signing up a new user
// Expects a request body with user details (e.g., username, password, email).
// Calls `userController.createUser` middleware to create a new user in the database.
// Responds with status 201 and the created user information in `res.locals.createdUser`.
app.post('/api/signup', userController.createUser, (req, res) => {
  res.status(201).json(res.locals.createdUser);
});

// Route for logging in an existing user
// Expects a request body with user login details (e.g., username, password).
// Calls `userController.loginUser` middleware to authenticate the user.
// Responds with status 200 and the logged-in user information in `res.locals.loggedinuser`.
app.post('/api/login', userController.loginUser, (req, res) => {
  res.status(200).json(res.locals.loggedinuser);
});

app.get(
  '/events',
  awsController.getEvents,
  awsController.countOn,
  ipLocController.injectLocs,
  (_req, res) => {
    return res.status(200).json(res.locals.events);
  }
);

app.post(
  '/credentials',
  awsController.setCredentials,
  userController.saveUserAwsCredentials,
  (_req, res) => {
    return res.status(201).json(res.locals.updatedUser);
  }
);

app.use((error, _req, res, _next) => {
  const DEFAULT_ERROR = {
    log: 'An Unkown middleware error occurred',
    status: 500,
    message: {
      err: 'A server error has occurred',
    },
  };
  const specificError = { ...DEFAULT_ERROR, ...error };
  console.error(specificError.log);
  return res.status(specificError.status).json(specificError.message);
});

ViteExpress.listen(app, PORT, async () => {
  const { root, base } = await ViteExpress.getViteConfig();
  console.log(`Serving app from root ${root}`);
  console.log(`Server is listening at http://localhost:${PORT}${base}`);
  console.log();
  console.log(
    '>>======================================================================<<'
  );
  console.log();
});
