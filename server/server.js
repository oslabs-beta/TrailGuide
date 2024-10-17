import express from 'express';
import ViteExpress from 'vite-express';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
