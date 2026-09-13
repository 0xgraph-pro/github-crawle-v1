const GITHUB_TOKEN = import.meta.env.GITHUB_TOKE;

const API_URL = "https://api.github.com";
const MAX_DEPTH = 2;

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

    results.push(...users);

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
async function crawlFollowing(username, depth = 0, visited = new Set()) {
  if (depth > MAX_DEPTH) {
    return;
  }

  if (visited.has(username)) {
    return;
  }

  visited.add(username);

  console.log(
    `${"  ".repeat(depth)}→ ${username} (depth ${depth})`
  );

  const following = await getFollowing(username);

  for (const user of following) {
    const user_data = await githubRequest(`${API_URL}/users/${user.login}`);
    const social_data = await githubRequest(`${API_URL}/users/${user.login}/social_accounts?per_page=100`);
    self.postMessage({ flag: "data", data: { ...user_data, social_data } });
    
    await crawlFollowing(
      user.login,
      depth + 1,
      visited
    );
  }
}

self.onmessage = e => {
  // Starting GitHub username
  const START_USERNAME = e.data;
  
  crawlFollowing(START_USERNAME)
    .then(() => {
      self.postMessage({ flag: "finished" });
    })
    .catch(console.error);
}