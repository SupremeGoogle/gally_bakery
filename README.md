# Gally Family Bakery

One-page React site for Gally Family Bakery with animated sections, editable catalog, contact form, privacy consent page and an admin panel.

## Local development

```bash
npm install
npm run dev
```

Open:

- Site: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin`
- Consent page: `http://localhost:5173/privacy`

Admin password: `gally062026`

## Admin workflow

The admin panel lets the bakery owner edit products, categories, photos, and business contact details without touching code. Changes are kept in the browser while editing. Click **Save changes** in the admin panel to publish updates through the Vercel API using the GitHub token stored in Vercel environment variables.

Product and category photos can be uploaded from the device or added by image URL. Customer requests are available in the **Requests** tab.

## Google Sheets form

1. Create a Google Sheet.
2. Open Extensions -> Apps Script.
3. Paste the code from `scripts/google-apps-script.js`.
4. Deploy as Web App.
5. Set access to "Anyone".
6. Copy the Web App URL.
7. Set the URL as `VITE_APPS_SCRIPT_URL` in Vercel.

Requests will be appended to a sheet named `Requests`.

Current Google Sheet:

`https://docs.google.com/spreadsheets/d/1OCYrc2V3IM1HqL3jadGNBk65GcPZclYKNXPMkWpHMyI/edit?gid=0#gid=0`

## Vercel environment variables

Use these variables in Vercel Project Settings -> Environment Variables:

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwWFpv1tk_aRmyad2Lahv30yX_3KDeNzc0fI1gHHlD59Mk7pmYF7c5tSGy8SH_h04lc/exec
ADMIN_PASSWORD=gally062026
GITHUB_TOKEN=your_new_github_token
GITHUB_OWNER=SupremeGoogle
GITHUB_REPO=gally_bakery
GITHUB_BRANCH=main
```

Do not commit a real GitHub token to the repository. Store it only in Vercel environment variables.

## Build

```bash
npm run build
```
