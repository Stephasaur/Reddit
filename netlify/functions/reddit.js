exports.handler = async (event) => {
  const { user, type } = event.queryStringParameters || {};
  if (!user || !type) {
    return { statusCode: 400, body: "Missing user or type" };
  }

  const redditType = type === "post" ? "link" : "comment";
  const url = `https://www.reddit.com/search.json?q=author%3A(${encodeURIComponent(user)})&type=${redditType}&sort=new&limit=25`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "reddit-feed-app/1.0" },
    });
    if (!res.ok) throw new Error(`Reddit returned ${res.status}`);
    const json = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(json),
    };
  } catch (e) {
    return { statusCode: 502, body: e.message };
  }
};
