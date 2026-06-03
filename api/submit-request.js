const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwWFpv1tk_aRmyad2Lahv30yX_3KDeNzc0fI1gHHlD59Mk7pmYF7c5tSGy8SH_h04lc/exec';

function looksLikeAccessDenied(text) {
  return /access|zugriff|доступ|permission|berechtigung|need access/i.test(text);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.VITE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
  const payload = request.body;

  if (!payload || typeof payload !== 'object') {
    return response.status(400).json({ error: 'Missing request payload' });
  }

  try {
    const scriptResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    const text = await scriptResponse.text();

    if (!scriptResponse.ok || looksLikeAccessDenied(text)) {
      return response.status(502).json({
        error: 'Google Apps Script is not publicly accessible. Deploy it as a Web App with access set to Anyone.',
      });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(502).json({ error: error.message || 'Could not send request to Google Sheets' });
  }
}
