# Deploying the Astro site (web/)

This Astro app reads all content from Sanity (`qspgm6e7` / `production`) at build
time and outputs a static site to `web/dist`. It does not need the old
`published-content.json` / LocalStorage workflow — editing now happens in Sanity
Studio (`studio/`).

**Content changes require a rebuild.** Sanity Studio edits don't appear on the
live site until the next deploy. If you want edits to go live automatically,
add a Sanity webhook (Settings → API → Webhooks) that hits your host's deploy
hook URL on publish.

## Vercel
Root `vercel.json` (already updated in this repo) sets:
- Build Command: `cd web && npm install && npm run build`
- Output Directory: `web/dist`

If the Vercel project's dashboard has its own Build/Output Directory settings
configured (Project → Settings → Build & Development Settings), those can
override `vercel.json` — check that they're either unset (so `vercel.json`
takes effect) or match the values above.

## Cloudflare Pages
In the Pages project settings (Settings → Builds & deployments):
- Build command: `cd web && npm install && npm run build`
- Build output directory: `web/dist`
- Root directory: `/` (repo root)

## Environment
No secrets needed — the Sanity dataset is public/read-only for this build.
`src/lib/sanity.ts` has the project ID and dataset hardcoded; move them to
environment variables (`PUBLIC_SANITY_PROJECT_ID` etc.) if that ever changes.
