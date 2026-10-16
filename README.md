# CROP Frontend

React single-page app for **CROP - Crop Control and Radical Outbreak Protection**: a farm-health and
pest-outbreak dashboard (Dashboard, Farm, Pests, Guidance, Help, Alerts, Settings) in
English and Arabic (full RTL). It follows `04-detailed-arch/01-frontend-architecture.md` and the
approved Figma design.

Right now it runs **without any backend**: an in-browser mock API answers every request with sample
farm data, and people sign in / register with their **Google account**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173 - works with NO backend (mock API)
npm test         # Vitest: unit + component tests
npm run build    # production build in dist/
```

Without a Google client id (see below) the login page shows a "Continue with the demo account"
button, so the app is always reachable. With a client id it shows the official Google button.

## Deploy on Vercel (no backend needed)

1. Push this folder to a Git repository (or run `npx vercel` from this folder).
2. In Vercel: **Add New > Project**, pick the repo. Vercel detects Vite; `vercel.json` already sets
   the build command, the `dist` output folder and the single-page-app rewrite (so `/farm`,
   `/guidance`, ... also work on refresh).
3. Under **Settings > Environment Variables** add `VITE_GOOGLE_CLIENT_ID` (next section). Nothing
   else is required: mock mode is the default (`VITE_USE_MOCKS` is on unless set to `false`).
4. Redeploy after adding or changing a variable (Vite reads them at build time).

## Google sign-in (anyone with a Google account can register)

Sign-in and registration are the same step: the first time a Google account signs in, the app
creates its account (role `OrgAdmin`, language from the page). Setup, about 5 minutes, no code:

1. Google Cloud Console > create/select a project > **APIs & Services > OAuth consent screen**.
   Choose **External**, fill the app name and your email, then press **Publish app**
   (status "In production"). If you leave it in "Testing", only the test users you list can sign in.
   The basic scopes used here (`openid`, `email`, `profile`) need no Google verification.
2. **APIs & Services > Credentials > Create credentials > OAuth client ID > Web application**.
3. **Authorized JavaScript origins**: add `http://localhost:5173` and your Vercel address
   (`https://<your-project>.vercel.app` and any custom domain). Origins must match exactly; wildcards are
   not allowed, so Vercel *preview* URLs will not sign in - use the production URL. No redirect URI is needed.
4. Copy the client id (`...apps.googleusercontent.com`) into `VITE_GOOGLE_CLIENT_ID` in Vercel
   (and in `.env` for local use).

Important limits of this temporary setup: the browser only decodes and sanity-checks Google's token
(`src/utils/googleCredential.js`); nobody verifies its signature because there is no server yet. That is fine
for sample data, but real farm data needs the backend to verify the token (see "When the backend arrives").
Accounts, edited names and language choices are kept in the browser's `localStorage`
(`src/mocks/mockAccounts.js`), so they are per browser, not shared between devices.

## Google Maps (the farm location on a real map)

The Farm Overview "Parcels Health & Orthomosaic Satellite Grid", the "New Field" boundary drawer and the
regional risk map on Alerts all use the **Google Maps JavaScript API** (satellite imagery of the farm
location with the parcel polygons drawn on top). Until a key exists they fall back to a built-in SVG map,
so the app always works. Setup, about 5 minutes, no code:

1. Google Cloud Console > select the project > **APIs & Services > Library** > enable **Maps JavaScript API**.
2. Make sure the project has a **billing account** (Google Maps Platform requires one; it includes a monthly
   free usage allowance - check the current pricing page).
3. **APIs & Services > Credentials > Create credentials > API key**, then **restrict it**:
   *Application restrictions* = Websites (HTTP referrers) with `http://localhost:5173/*` and
   `https://<your-project>.vercel.app/*` (plus any custom domain); *API restrictions* = Maps JavaScript API only.
   The key ships inside the public JavaScript, so these two restrictions are what protect it.
4. Put the key (`AIza...`) in `VITE_GOOGLE_MAPS_API_KEY` in Vercel (and in `.env` locally) and **redeploy**.
5. To move the sample farm to its real place, edit `ORIGIN_LON` / `ORIGIN_LAT` in
   `src/mocks/fixtures/geometry.js` and `DEFAULT_MAP_CENTER` in `src/lib/mapDefaults.js`.

If Google rejects the key (wrong referrer, API not enabled, billing off) the Farm map shows the SVG map
plus a short note, and the browser console shows Google's own error message.

## Environment (`.env`, see `.env.example`)

| Variable | Meaning |
|---|---|
| `VITE_USE_MOCKS` | Mock API is ON unless this is `false`. Set `false` only when the backend is live |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Web client id (public value). Missing/placeholder = demo-account button instead |
| `VITE_API_BASE_URL` | ASP.NET Core backend (REST + SignalR hub share it). Used only when mocks are off |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key (public value, restrict by referrer). Missing/placeholder = built-in SVG map |
| `VITE_CHAT_WIDGET_APP_ID` | Live-chat vendor app id (ADR-021, vendor not chosen yet) |

## When the backend arrives

Set `VITE_USE_MOCKS=false` and `VITE_API_BASE_URL`. The frontend then calls these endpoints; the one
new contract compared with `03-main-architecture.md` is Google sign-in:

- `POST /api/v1/auth/google` with `{ credential, preferredLanguage }` -> `{ accessToken }` (+ refresh
  cookie). The backend must verify the Google ID token (signature, `aud` = your client id, `exp`,
  `email_verified`) and create the user + organization on first sight. The existing
  `/auth/login` and `/auth/register` endpoints are no longer called by the UI.
- Everything else (`/auth/refresh`, `/auth/logout`, `/users/me`, ...) is unchanged. `/users/me`
  may also return `pictureUrl`, which the top bar shows as the avatar.

## Folder map

```
src/
  main.jsx, App.jsx        entry + route table + auth gate (RequireAuth); signed-in screens load lazily
  i18n/                    i18next setup + locales/{en,ar}/{common,dashboard,farm,pests,guidance,help}.json
  routes/                  one file per screen (12)
  components/
    auth/                  GoogleAuthPanel (Google button / demo fallback) used by Login + Register
    layout/                AppShell, TopNav, LanguageSwitcher, PageHero, PageContainer
    dashboard/ farm/ pests/ guidance/ help/ alerts/ charts/   feature components
    ui/                    shadcn-style primitives (Radix + Tailwind)
  hooks/                   React Query wrapper per backend endpoint group; useAuth = Google sign-in/out
  stores/                  Zustand: authStore (token in memory), uiStore (selected species/field)
  services/                apiClient (axios + JWT + 401 refresh), signalrClient, googleIdentity (Google sign-in script), googleMaps (Maps loader)
  mocks/                   in-browser mock API (mockAdapter, mockAccounts + fixtures)
  utils/ lib/              pure helpers (colours, dates, GDD maths, Google credential, map projection / overlays), env, constants
  assets/                  logo + pest photos (1036 px wide, cropped from the Figma frames; replace with the Figma exports for maximum sharpness)
  tests/                   setup, unit, components
vercel.json                Vercel build + SPA rewrite + cache headers
```

## Conventions

- Every file starts with an English header comment; every function has a one-line comment.
- **RTL**: only Tailwind logical utilities (`ms-/me-/ps-/pe-/start-/end-/text-start`). A unit test
  (`logicalProperties.test.js`) fails the build if a physical one (`ml-`, `text-left`, ...) appears.
- **Design tokens** (Figma style guide) live in `tailwind.config.js`: Primary `#0F4D10`,
  Secondary `#4CAF50`, Tertiary `#F4C04E`, Neutral `#2E2E2E`, font Plus Jakarta Sans.
- Server state = React Query; UI state = Zustand; no business logic inside route files.
- Risk is three-tier everywhere: `Low` (<40%), `Mid` (40-69%), `High` (>=70%) - ADR-015.

## Left out on purpose (review round 2)

Billing/plans page, species subscribe/unsubscribe, the Farmer/Government wording switch (and the
Government role in the invite list), and the manual trap/soil-moisture/irrigation forms on the field page are
**not** in the UI. Their endpoints still exist in `03-main-architecture.md`; the frontend simply does not
call them. The backend contract also keeps `messageGovernment` on alerts - the UI shows `messageFarmer` only.

## Swapping things later

| Want to... | Change only... |
|---|---|
| Connect the real chat vendor | `components/help/ChatWidgetLauncher.jsx` (`startChat`) |
| Change where the sample farm sits | `src/mocks/fixtures/geometry.js` + `src/lib/mapDefaults.js` |
| Replace a pest photo | overwrite the file in `src/assets/pests/` (same name, 4:3 works best) |
| Add a language | new `locales/<code>/` folder + `SUPPORTED_LANGUAGES` in `i18n/i18n.js` |
| Change a species threshold shown in mock mode | `src/mocks/fixtures/species.js` |
