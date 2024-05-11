const express = require("express");
const drawCanvas = require('./functions/drawCanvas');
require('dotenv').config();

const app = express();
const port = 8000;

app.get('/', (_, res) => {
  res.send('Hi!');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

app.get("/render", async (req, res) => {
  const { id, mode, description, color, bgColor, image, key } = req.query;
  if (!id || !mode) return res.status(400).send({ code: 400, error: 'Missing ID or mode' });
  if (!key || key != process.env.RENDER_KEY) return res.status(401).send({ code: 401, error: 'Missing key or incorrect key' });
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const start = performance.now();
  try {
    const buffer = await drawCanvas(id, mode, client_id, client_secret, description, color, bgColor, image);
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, error: 'Failed to render image' });
  }
  const end = performance.now();
  console.log('script took', ((end - start) / 1000).toFixed(3) + 's to run\n\n');
});