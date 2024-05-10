let fetch = require('node-fetch');
const cache = new Map();
import("ultrafetch").then(async ufetch => {
  ufetch.withCache(fetch, { cache: cache });
});

const fetchData = {
  login: async (client_id, client_secret) => {
    const response = await fetch(`https://osu.ppy.sh/oauth/token`, {
      method: "POST",
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id,
        client_secret,
        scope: 'public',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  fetchProfile: async (id, mode, client_id, client_secret) => {
    const { access_token } = await fetchData.login(client_id, client_secret);
    const response = await fetch(`https://osu.ppy.sh/api/v2/users/${id}/${mode}`, {
      headers: { "Authorization": `Bearer ${access_token}` }
    });
    setTimeout(() => {
      cache.clear();
    }, 12 * 60 * 60 * 1000);
    return await response.json();
  },

  fetchTops: async (id, mode, client_id, client_secret) => {
    const { access_token } = await fetchData.login(client_id, client_secret);
    const response = await fetch(`https://osu.ppy.sh/api/v2/users/${id}/scores/best?mode=${mode}&limit=51`, {
      headers: { "Authorization": `Bearer ${access_token}` }
    });
    setTimeout(() => {
      cache.clear();
    }, 5 * 60 * 1000);
    return await response.json();
  }
};

module.exports = fetchData;