# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build multi-page marketing site for Visions Braid Bar (a braiding salon in Oxon Hill, MD). There is no package.json, bundler, linter, or test suite — it's plain HTML/CSS/JS served as-is. "Developing" here means editing the HTML/CSS/JS files directly and viewing them in a browser.

To preview locally, serve the directory with any static file server (e.g. `npx serve .` or `python -m http.server`) and open `index.html` — opening the file directly via `file://` also works since there's no server-side logic, but relative links/fetches behave more reliably over http.

There is no build, lint, or test command for this repo.

## Origin and reference file

`Visions Braids Bar Artifact.html` is the original single-page mockup (a Claude.ai Artifact export) that this site was rebuilt from. It's kept as the source of truth for original brand copy, section structure, and the original CSS custom properties — not part of the live site. When in doubt about original wording/structure, diff against it rather than guessing.

## Page architecture

The site is 7 independent HTML pages sharing two files: `styles.css` and `app.js`.

- `index.html`, `services.html`, `about.html`, `locations.html`, `faqs.html`, `contact.html`, `blog.html`

**`index.html` is intentionally NOT a full HTML document** — it has no `<!doctype>`, `<html>`, `<head>`, or `<body>` tags; it starts directly with `<title>` and a `<link rel="stylesheet">`. This is a holdover from this project being published as a Claude.ai Artifact, where the main entry file is auto-wrapped with a skeleton (charset/viewport meta + base reset) by the publishing tool at deploy time. **Every other page is a fully standalone document** (own doctype/head/body) because only the designated main-entry file gets auto-wrapped. If you ever change which file is the "main" artifact entry, or deploy this outside the Artifact tool, `index.html` will need its own doctype/head/body added to render correctly.

Navigation between pages uses real relative hrefs (`services.html`, `about.html`, etc.), not anchors. There's no templating — the nav/footer markup is duplicated verbatim across all 7 HTML files, with the current page's link hardcoded as `class="active" aria-current="page"` at the point it was authored. Adding/renaming/removing a nav item means editing it in all 7 files consistently.

## Shared CSS/JS conventions

- `styles.css`: brand colors and fonts are defined as CSS custom properties at the top of the file (do not hardcode hex values in component rules — extend the token set instead). Fonts are Playfair Display (display/headings) and Montserrat (body), loaded from Google Fonts in each page's `<head>`.
- `app.js` is shared by every page and is written defensively: each feature (ticker marquee, service tabs, FAQ accordion, mobile menu, newsletter form, scroll-reveal) guards on `if (element) { ... }` before wiring up, because not every page has every component. Follow this same guard pattern for new interactive bits so `app.js` stays a single file usable everywhere.
- Scroll-reveal pattern: elements get `class="reveal"` in markup, but there is **no CSS rule for bare `.reveal`** — `app.js` adds `reveal-armed` at runtime via IntersectionObserver, and only `reveal-armed.reveal-visible` (also JS-added) is styled to fade/slide in. This is deliberate progressive enhancement: if JS fails to load, `.reveal` elements have no hiding rule and stay fully visible instead of being stuck invisible.

## Content/asset notes

- `logo.png` is the brand logo with its background made transparent (the original export was an opaque JPEG mislabeled as `.png`); it's referenced by every page's nav and footer. `logo-transparent.png` is kept alongside it as the same processed asset.
- All "Book Now" CTAs across every page point to the same external Phorest booking URL (`https://phorest.com/book/salons/visionsbraidbar`) — treat that as the single source of truth for booking links.
- Several footer/nav links intentionally point to `#` (Booking Terms, Length Guide, Color Guide, Partnerships) because those destination pages don't exist yet. These are deliberate pre-launch placeholders carried over from the original artifact, not broken links to fix.
- The decorative inline SVG artwork in the HTML (braid/cornrow/loc motifs standing in for photography) was generated programmatically rather than hand-authored, but the generator script itself was not committed to this repo — only its output. If you need to regenerate or add similar artwork, you'll be writing that generation logic fresh rather than finding it checked in here.
