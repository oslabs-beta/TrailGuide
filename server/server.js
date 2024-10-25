import express from 'express';
import ViteExpress from 'vite-express';
import userController, { setupDb } from './controllers/userController.js';
import pool from './db/db.js';

const PORT = 8080;

const app = express();

setupDb();

//test the connection with database
pool
  .connect()
  .then((client) => {
    console.log('Successfully connected with database.');
    client.release();
  })
  .catch((err) => {
    console.error('Connection Error in Connecting with database', err.stack); //a property of the Error object that contains a string representing the error message and the stack trace.
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//signup router
app.post('/api/signup', userController.createUser);

//login router
app.post('/api/login', userController.loginUser);

// route to get all users
// app.get('/api/users', userController.getAllUsers);

// app.get('/api/user', userController.getUserByField);

//Global Error Handler Middleware
app.use((err, req, res, next) => {
  //The error.stack property is a string describing the point in the code at which the Error was instantiated.
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
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
