const DEFAULT_OWNER = 'SupremeGoogle';
const DEFAULT_REPO = 'gally_bakery';
const DEFAULT_BRANCH = 'main';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

function extensionFor(mimeType, filename = '') {
  const fromName = filename.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[1];
  if (fromName) return fromName === 'jpeg' ? 'jpg' : fromName;
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

function safeName(filename) {
  return filename
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'image';
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!token || !adminPassword) {
    return response.status(500).json({ error: 'Image uploading is not configured' });
  }

  const authHeader = request.headers.authorization || '';
  const submittedPassword = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (submittedPassword !== adminPassword) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const { filename = 'image', mimeType = '', data = '' } = request.body || {};
  if (!ALLOWED_TYPES.has(mimeType)) {
    return response.status(400).json({ error: 'Use JPG, PNG, or WebP images' });
  }

  const base64 = String(data).includes(',') ? String(data).split(',').pop() : String(data);
  if (!base64) {
    return response.status(400).json({ error: 'Missing image data' });
  }
  if (Buffer.from(base64, 'base64').byteLength > MAX_IMAGE_BYTES) {
    return response.status(400).json({ error: 'Image is too large. Use an image under 6 MB' });
  }

  const owner = process.env.GITHUB_OWNER || DEFAULT_OWNER;
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
  const ext = extensionFor(mimeType, filename);
  const path = `public/assets/uploads/${Date.now()}-${safeName(filename)}.${ext}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const githubResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `Upload bakery image ${new Date().toISOString()}`,
        content: base64,
        branch,
      }),
    });

    const githubJson = await githubResponse.json();
    if (!githubResponse.ok) {
      return response.status(githubResponse.status).json({
        error: githubJson.message || 'GitHub image upload failed',
      });
    }

    return response.status(200).json({
      ok: true,
      path: `/${path.replace(/^public\//, '')}`,
      commit: githubJson.commit?.sha,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
