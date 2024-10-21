import express from 'express';
import ViteExpress from 'vite-express';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((error, res, _req, _next) => {
  const DEFAULT_ERROR = {
    log: 'An Unkown middleware error occurred',
    status: 500,
    message: {
      err: 'A server error has occurred',
    },
  };
  const specificError = { ...DEFAULT_ERROR, ...error };
  console.error(specificError.log);
  return res.status(specificError.status).json(specificError.json);
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
