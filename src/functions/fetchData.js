let token;
let tokenExpiresAt = 0;

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`osu! API request failed (${response.status}): ${message.slice(0, 200)}`);
  }

  return response.json();
};

const fetchData = {
  login: async (client_id, client_secret) => {
    if (token && Date.now() < tokenExpiresAt) return token;

    const data = await fetchJson('https://osu.ppy.sh/oauth/token', {
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

    token = data;
    tokenExpiresAt = Date.now() + Math.max(0, data.expires_in - 60) * 1000;
    return data;
  },

  fetchProfile: async (id, mode, client_id, client_secret) => {
    const { access_token } = await fetchData.login(client_id, client_secret);
    return fetchJson(`https://osu.ppy.sh/api/v2/users/${encodeURIComponent(id)}/${mode}`, {
      headers: { "Authorization": `Bearer ${access_token}` }
    });
  },

  fetchTops: async (id, mode, client_id, client_secret) => {
    const { access_token } = await fetchData.login(client_id, client_secret);
    return fetchJson(`https://osu.ppy.sh/api/v2/users/${encodeURIComponent(id)}/scores/best?mode=${mode}&limit=51`, {
      headers: { "Authorization": `Bearer ${access_token}` }
    });
  }
};

module.exports = fetchData;
