import express from 'express';
import ViteExpress from 'vite-express';

import router from './routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api', router);

ViteExpress.listen(app, PORT, async () => {
  const { root, base } = await ViteExpress.getViteConfig();
  console.log(`Serving app from root ${root}`);
  console.log(`Server is listening at http://localhost:${PORT}${base}`);
});
