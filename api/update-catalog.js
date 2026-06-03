const DEFAULT_OWNER = 'SupremeGoogle';
const DEFAULT_REPO = 'gally_bakery';
const DEFAULT_BRANCH = 'main';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!token || !adminPassword) {
    return response.status(500).json({ error: 'Server publishing is not configured' });
  }

  const authHeader = request.headers.authorization || '';
  const submittedPassword = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (submittedPassword !== adminPassword) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const catalog = request.body?.catalog;
  if (!catalog || typeof catalog !== 'object') {
    return response.status(400).json({ error: 'Missing catalog payload' });
  }

  const owner = process.env.GITHUB_OWNER || DEFAULT_OWNER;
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
  const path = 'data/catalog.json';
  const base = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const current = await fetch(`${base}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const currentJson = current.ok ? await current.json() : {};
    const content = Buffer.from(JSON.stringify(catalog, null, 2), 'utf8').toString('base64');

    const githubResponse = await fetch(base, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `Update bakery catalog ${new Date().toISOString()}`,
        content,
        branch,
        sha: currentJson.sha,
      }),
    });

    const githubJson = await githubResponse.json();
    if (!githubResponse.ok) {
      return response.status(githubResponse.status).json({
        error: githubJson.message || 'GitHub update failed',
      });
    }

    return response.status(200).json({
      ok: true,
      commit: githubJson.commit?.sha,
      url: githubJson.content?.html_url,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
