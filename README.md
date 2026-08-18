<p align="center">
  <img src="assets/logo-hero.png" alt="ContextVitals logo" width="120" />
</p>

<h1 align="center">ContextVitals</h1>

<p align="center">
  Know when your AI conversation needs a fresh start.
</p>

---

## What this is

This is the **landing page** for ContextVitals — a Chrome extension that watches
your ChatGPT or Claude conversation and estimates how much "context pressure"
it's under, so you know when it's time to start a new chat (and what to carry
over when you do).

**Live site:** not deployed yet — see [Deployment](#deployment) below.
**Get the extension:** https://github.com/ContextVitals-labs/ContextVitals-Extension

The page is available in **English, Korean, and Chinese** — use the language
switcher in the top-right corner, or it'll pick one automatically based on
your browser's language.

## What ContextVitals does

- **Context Meter** — live estimates of message count, token usage, and how
  full the conversation's context window is.
- **Context Health Score** — a single 0–100 risk score so you don't have to
  eyeball raw token counts.
- **New Session Alerts** *(coming soon)* — a nudge once a conversation is
  genuinely at risk, not a popup after every message.
- **Context Handoff** *(coming soon)* — a generated summary of goals,
  decisions, and next steps to bring into a fresh chat.

Everything runs locally in your browser. Your conversations are never sent
anywhere — see the Privacy section on the site for details.

---

## For contributors

This is a static site — no build step, no framework.

```
index.html          the whole page, marked up with data-i18n="..." keys
assets/styles.css   design tokens + layout (light/dark via prefers-color-scheme)
assets/i18n.js      all copy for en / ko / zh, keyed by the data-i18n attributes
assets/main.js      language detection/switching only
```

To preview locally, just open `index.html` in a browser, or serve the folder
with any static file server (e.g. `npx serve .`).

## Deployment

This repo is **private**, and GitHub Pages for private repositories requires
a paid GitHub plan (Team/Enterprise) — the free plan only serves Pages from
public repos. Nothing is deployed yet. Options once you're ready:

- Make this repo public and turn on Pages (Settings → Pages → deploy from
  `main` / `/`) — free, but the source becomes public too.
- Deploy to Vercel/Netlify/Cloudflare Pages instead — all three support
  private-repo deploys on their free tiers.
- Upgrade the GitHub org plan and use Pages as-is.

Commit, branch, and translation conventions are documented in
[`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) — read it before adding new copy,
especially the rule that every new string needs all three languages filled
in before it ships.
