<h1 align="center"><img src='https://i.imgur.com/hU7cF7r.png' height='100'><br>osu! skill card renderer</br></h1>
<p align="center">basically some fun formula to render an osu! image.<br>inspired by <a href="https://github.com/Tienei/TinyBot">tienei's tinybot</a>.</br></p>
<p align="center">
  <img src="https://forthebadge.com/images/badges/0-percent-optimized.png" height="36"/>
  <img src="https://raw.githubusercontent.com/abumalick/powered-by-vercel/master/powered-by-vercel.svg" height="36"/>
</p>

---
## About this project

My Discord app [Neko](https://github.com/NekoOfficial/Neko) has some backend logic to handle its card rendering, but I was lazy there so I copied everything off [tienei's repo](https://github.com/Tienei/TinyBot) and mocked everything so badly it takes up to 30 seconds to render something. And the idea is not organized at all.

So here we are, an attempt to make something better with a different approach. I have some plannings, sure, but this code is far from optimized for some on-demand rendering.

osu!std's player scorings are from [yorunoken](https://github.com/yorunoken), in their [fun-api repo](https://github.com/yorunoken/fun-api). I just used the calculations there directly, just so I don't have to handle files download or things like that.

osu!taiko, osu!catch and osu!mania's formulas are copied directly (with some taiko adjustments) from [tienei's tinybot repo](https://github.com/Tienei/TinyBot).

Thanks a lot for providing these so this project is possible.

---

## About the code & license

I don't expect the code to be readable or clean. I put no comments here, like at all, because I was and still am running deadlines. Just comment out lines and see what it does if you need to know it. 

License, [MIT license](/LICENSE), read that file. I don't have any other requirements, this is a learning project pushed to production. Make sure to put in secret keys, logics stay in files.

## Development

This project requires Node.js 24 and npm 11.

```sh
cp .env.example .env
npm install
npm run dev
```

Set `CLIENT_ID` and `CLIENT_SECRET` to osu! OAuth application credentials and
choose a private `RENDER_KEY`. Render a card with:

```sh
curl -H "x-render-key: your-key" \
  "http://localhost:8000/render?id=2&mode=osu" \
  --output card.png
```

The legacy `key` query parameter remains supported, but the request header is
recommended because URLs are commonly retained in logs and browser history.

## Deploying to Vercel

Import the repository in Vercel and add `CLIENT_ID`, `CLIENT_SECRET`, and
`RENDER_KEY` under Project Settings → Environment Variables. Vercel detects
`src/index.js` as an Express application; no `vercel.json`, custom build, or
output-directory setting is needed. Express applications use Fluid Compute by
default, and Vercel bundles files referenced by the application.

---
## Previews

<img src=https://i.imgur.com/5c2PG8E.png width=200>
<img src=https://i.imgur.com/ghEhOfj.png width=200>

---
## TODO

- Refactor render code
- Comment on things
- Fix bugs
- More features

No idea if I'll ever make these, anyway.
