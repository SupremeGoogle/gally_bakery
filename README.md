# Gally Family Bakery

One-page React site for Gally Family Bakery with animated sections, editable catalog, contact form, privacy consent page and an admin panel.

## Local development

```bash
npm install
npm run dev
```

Open:

- Site: `http://localhost:5173/`
- Admin: `http://localhost:5173/#/admin`
- Consent page: `http://localhost:5173/#/privacy`

Admin password: `gally062026`

## Admin workflow

The admin panel lets you edit products, categories and business contact details without touching HTML. Changes are saved in the browser immediately. Use the Publish tab to download `catalog.json` or save `data/catalog.json` to GitHub through the GitHub Contents API.

For GitHub save, create a fine-grained token with Contents read/write access to `SupremeGoogle/gally_bakery`, paste it in the admin panel, then click "Save catalog to GitHub".

## Google Sheets form

1. Create a Google Sheet.
2. Open Extensions -> Apps Script.
3. Paste the code from `scripts/google-apps-script.js`.
4. Deploy as Web App.
5. Set access to "Anyone".
6. Copy the Web App URL.
7. Paste the URL in Admin -> Business -> Google Apps Script Web App URL.

Requests will be appended to a sheet named `Requests`.

## Build

```bash
npm run build
```
