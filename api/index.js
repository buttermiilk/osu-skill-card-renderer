const express = require("express");
const drawCanvas = require('./functions/drawCanvas');
require('dotenv').config({ quiet: true });

const app = express();
const port = Number(process.env.PORT) || 8000;

app.get('/', (_, res) => {
  res.json({
    name: 'osu! skill card renderer',
    status: 'ok',
    render: '/render?id=<osu-user-id>&mode=<osu|taiko|fruits|mania>',
  });
});

app.get("/render", async (req, res) => {
  const { id, mode, description, color, bgColor, image } = req.query;
  const key = req.get('x-render-key') || req.query.key;

  if (!id || !mode) return res.status(400).send({ code: 400, error: 'Missing ID or mode' });
  if (!['osu', 'taiko', 'fruits', 'mania', '0', '1', '2', '3'].includes(mode)) {
    return res.status(400).send({ code: 400, error: 'Invalid mode' });
  }
  if (!process.env.RENDER_KEY || key !== process.env.RENDER_KEY) {
    return res.status(401).send({ code: 401, error: 'Missing key or incorrect key' });
  }

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  if (!client_id || !client_secret) {
    return res.status(503).send({ code: 503, error: 'osu! API credentials are not configured' });
  }

  const start = performance.now();
  try {
    const buffer = await drawCanvas(id, mode, client_id, client_secret, description, color, bgColor, image);
    res.set({
      'Cache-Control': 'private, no-store',
      'Content-Type': 'image/png',
    });
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, error: 'Failed to render image' });
  }
  const end = performance.now();
  console.log('script took', ((end - start) / 1000).toFixed(3) + 's to run\n\n');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
}

module.exports = app;
