# Muhamad Zikri Alviansyah — Portfolio

Personal portfolio website for Muhamad Zikri Alviansyah, IT Infrastructure & Network Engineer.

## Stack

- Static site: plain HTML, CSS, and minimal vanilla JavaScript (no framework, no build step)
- No backend, no database, no API keys, no environment variables

## Local development

```bash
npx serve .
# or
vercel dev
```

## Deploy

> Beginner-friendly Indonesian guide (concepts, every command explained,
> troubleshooting): see [DEPLOYMENT.md](DEPLOYMENT.md).

### GitHub Pages (primary)

Published from the `mzikrialviansy12.github.io` repository — no build step needed:

```bash
git add .
git commit -m "update site"
git push
```

GitHub Pages rebuilds automatically from the `main` branch root and the site goes
live at `https://mzikrialviansy12.github.io/` within a minute or two.
`.nojekyll` disables Jekyll processing so every file is served as-is.

### Vercel (alternative)

```bash
vercel
```

## Structure

```
index.html                              # One-page portfolio (4 tabs: About, Experience, Lab, Work)
.nojekyll                                # Tells GitHub Pages to skip Jekyll processing
assets/
  css/style.css                        # Site styles
  js/main.js                           # Tab routing, lab filters
  favicon.svg                          # Favicon
  network-topology.svg                 # Project diagram asset
content/
  proxmox-datastore-incident.html     # Project case study page
```

## Notes

- Content sourced from the author's CV; missing items are marked TODO on the page.
- Tabs use hash routing: `#about`, `#experience`, `#lab`, `#work` (default `#about`).
- Do not commit: `.env`, original CV PDF, phone number, or `drafts/` folder.
- Site language: English only. Contact form intentionally omitted; email link only.
