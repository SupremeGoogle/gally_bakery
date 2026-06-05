# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run lint       # ESLint check
```

There are no tests. No test runner is configured.

Dev routes:
- `http://localhost:5173/` — public site
- `http://localhost:5173/admin` — admin panel (password: `gally062026`)
- `http://localhost:5173/privacy` — privacy/consent page

## Architecture

This is a hash-routed React app (Vite + React 19) with Vercel serverless API routes. The entire frontend lives in one file: `src/main.jsx`.

**Frontend (`src/main.jsx`)**

Routing is hash/pathname-based with no router library — `App` reads `location.hash` or `location.pathname` and renders:
- `HomePage` — public bakery homepage (hero, categories, reviews, working-with-us, contact form)
- Category/detail pages — `#/cakes`, `#/macarons`, `#/desserts`, `#/portfolio`, `#/about`
- `AdminPage` — password-protected content editor
- `PrivacyPage` — static personal data consent page

Catalog state is managed in `App` via `useState`, persisted to `localStorage` under key `gally_bakery_catalog_v3`, and seeded from `data/catalog.json` on first load. The `catalog` object includes `business`, `home`, `pages`, `categories`, `products`, `portfolio`, and `reviews`.

The `asset(path)` helper resolves relative asset paths using `import.meta.env.BASE_URL` so images work correctly whether served locally or from a subdirectory. Images from `http`/`data:` URLs are passed through unchanged.

**Admin panel (`AdminPage`)**

Tabs: Home, Pages, Products/Categories, Portfolio, Reviews, Business, Requests. Changes mutate catalog state in the browser. **Save changes** calls `POST /api/update-catalog`, which commits `data/catalog.json` directly to the GitHub repo via the GitHub Contents API — this triggers a Vercel redeploy. Image uploads (`POST /api/upload-image`) commit new files under `public/assets/uploads/` to GitHub.

Admin auth uses a plaintext password stored in `ADMIN_PASSWORD` env var (or the hardcoded fallback). The password is sent as a `Bearer` token to the API routes. Session is kept in `sessionStorage`.

**Serverless API (`api/`)**

Three Vercel functions — all use ES module syntax (`export default async function handler`):

- `api/submit-request.js` — forwards contact form submissions to Google Apps Script, which appends a row to Google Sheets
- `api/update-catalog.js` — commits updated `data/catalog.json` to GitHub
- `api/upload-image.js` — commits a new image file to `public/assets/uploads/` on GitHub (max 6 MB, JPG/PNG/WebP only)

**Google Apps Script (`scripts/google-apps-script.js`)**

Standalone script deployed as a Google Apps Script Web App. Appends form submissions to a `Requests` sheet. Must be deployed separately — not part of the Vite build.

**Vercel config (`vercel.json`)**

All `/api/*` requests route to the serverless functions; everything else rewrites to `index.html` for client-side routing.

## Environment variables

Copy `.env.example` to `.env.local` for local development. The API routes only run on Vercel in production; during local dev the contact form and admin save/upload will fail unless you proxy or mock them.

| Variable | Used by |
|---|---|
| `VITE_APPS_SCRIPT_URL` | Frontend (contact form URL fallback) |
| `APPS_SCRIPT_URL` | `api/submit-request.js` |
| `ADMIN_PASSWORD` | `api/update-catalog.js`, `api/upload-image.js` |
| `GITHUB_TOKEN` | `api/update-catalog.js`, `api/upload-image.js` |
| `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | Both catalog/image API routes |

`GITHUB_TOKEN` needs `contents: write` permission on the repo. Never commit a real token.
