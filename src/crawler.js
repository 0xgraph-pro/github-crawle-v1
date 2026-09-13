var GITHUB_TOKEN;
var MAX_DEPTH = 1;

const API_URL = "https://api.github.com";

const VISITED = new Set();

async function githubRequest(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
      ...(GITHUB_TOKEN
        ? {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          }
        : {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error ${response.status}: ${await response.text()}`
    );
  }

  return response.json();
}

/**
 * Get everyone a user follows.
 */
async function getFollowing(username) {
  const results = [];

  let page = 1;

  while (true) {
    const url =
      `${API_URL}/users/${encodeURIComponent(username)}/following` +
      `?per_page=100&page=${page}`;

    const users = await githubRequest(url);
    
    if (users.length === 0) {
      break;
    }

    results.push(...users.map(user => user.login));

    // Less than 100 means this was the last page.
    if (users.length < 100) {
      break;
    }

    page++;
  }

  return results;
}

/**
 * Recursively traverse the GitHub following graph.
 */
async function crawlFollowing(username, depth = 0) {
  if (depth > MAX_DEPTH) {
    return;
  }

  if (VISITED.has(username)) {
    return;
  }

  VISITED.add(username);

  console.log(
    `${"  ".repeat(depth)}→ ${username} (depth ${depth})`
  );

  const following = await getFollowing(username);

  const pick = (obj, keys) => Object.fromEntries(keys.map(key => [key, obj[key]]));

  for (const user of following) {
    const user_data = await githubRequest(`${API_URL}/users/${user}`);
    const social_data = await githubRequest(`${API_URL}/users/${user}/social_accounts?per_page=100`);
    self.postMessage({ flag: "data", data: { ...pick(user_data, ["login", "avatar_url", "name", "company", "blog", "location", "email", "bio", "public_repos", "followers", "following"]), social_data } });
    
    await crawlFollowing(
      user,
      depth + 1,
    );
  }
}

self.onmessage = e => {
  // Starting GitHub username
  const START_USERNAME = e.data.crawler_user;

  GITHUB_TOKEN = e.data.token;

  MAX_DEPTH = e.data.depth;
  
  crawlFollowing(START_USERNAME)
    .then(() => {
      self.postMessage({ flag: "finished" });
    })
    .catch(console.error);
}