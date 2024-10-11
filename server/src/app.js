import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import ViteExpress from 'vite-express';

import router from './routes/routes.js';

// ViteExpress.config({});

const app = express();

app.use(express.json());

app.use('/api', router);

const PORT = process.env.PORT || 8080;

ViteExpress.listen(app, PORT, async () => {
  const { root, base } = await ViteExpress.getViteConfig();
  console.log(`Serving app from root ${root}`);
  console.log(`Server is listening at http://localhost:${PORT}${base}`);
});
