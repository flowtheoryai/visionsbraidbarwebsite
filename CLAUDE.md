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

**All 7 pages, including `index.html`, are now fully standalone HTML documents** (own doctype/head/body). `index.html` used to be a bare fragment (no doctype/html/head/body) relying on the Claude.ai Artifact publishing tool to auto-wrap it at deploy time — that only worked while the site was previewed/hosted through that tool. Since the plan is to deploy this site directly as static files (e.g. via Vercel), `index.html` was converted to a full document like the other 6 pages so it renders correctly with no external wrapping step.

Every page's `<head>` now also carries: a unique `<meta name="description">`, a `<link rel="canonical">`, Open Graph/Twitter card tags, a `HairSalon` JSON-LD schema block (name, address, phone, hours), and a placeholder GA4 `gtag.js` snippet (`G-XXXXXXXXXX`) — swap in the real Measurement ID once a GA4 property exists. Canonical/OG URLs assume the production domain `https://www.visionsbraidbar.com/`; update them if the final domain differs.

Navigation between pages uses real relative hrefs (`services.html`, `about.html`, etc.), not anchors. There's no templating — the nav/footer markup is duplicated verbatim across all 7 HTML files, with the current page's link hardcoded as `class="active" aria-current="page"` at the point it was authored. Adding/renaming/removing a nav item means editing it in all 7 files consistently.

## Shared CSS/JS conventions

- `styles.css`: brand colors and fonts are defined as CSS custom properties at the top of the file (do not hardcode hex values in component rules — extend the token set instead). Fonts are Playfair Display (display/headings) and Montserrat (body), loaded from Google Fonts in each page's `<head>`.
- `app.js` is shared by every page and is written defensively: each feature (ticker marquee, service tabs, FAQ accordion, mobile menu, newsletter form, scroll-reveal) guards on `if (element) { ... }` before wiring up, because not every page has every component. Follow this same guard pattern for new interactive bits so `app.js` stays a single file usable everywhere.
- Scroll-reveal pattern: elements get `class="reveal"` in markup, but there is **no CSS rule for bare `.reveal`** — `app.js` adds `reveal-armed` at runtime via IntersectionObserver, and only `reveal-armed.reveal-visible` (also JS-added) is styled to fade/slide in. This is deliberate progressive enhancement: if JS fails to load, `.reveal` elements have no hiding rule and stay fully visible instead of being stuck invisible.
- Staggered grid entrance: give a grid wrapper `class="...  stagger"` (instead of putting `reveal` on the wrapper) and leave its direct children as plain cards — `app.js` promotes every direct child of `.stagger` to `class="reveal"` at runtime (before the reveal observer wires up) and `.stagger>*:nth-child(n)` in `styles.css` sets an incremental `--reveal-delay` custom property per child (up to the 10th), consumed by `.reveal-armed.reveal-visible`'s `transition-delay`. Never put `reveal` on both a `.stagger` wrapper and its children — the parent fading from opacity 0 would mask/double the children's own fade and break the cascade. Used on `index.html`'s `.svc-grid`, `.testi-grid`, `.ig-grid`, `.bi-grid`, and `.locations`.
- Single-value entrance delays: a handful of non-grid elements (`.hero-right`, `.review-strip`, `.strip`) set `--reveal-delay` directly in `styles.css` (not via `.stagger`) to sequence the hero's load-in by hand.
- The homepage's "Shuffle Through Our Styles" section (`#shuffle-deck` / `#shuffle-stack` in `index.html`) is a JS-rendered fanned card deck, built the same way the ticker is: an empty container in HTML, filled at runtime from a `serviceCards` data array in `app.js` (mirrors the ticker's `services` list, 2 entries use real photos from `images/`, the rest use `.shuffle-grad-g1`–`g6` CSS gradients built from the existing color tokens). Position state is a `data-pos` attribute (`front`/`right`/`left`/`hidden`) driven by an `order` array that gets rotated on `shuffleNext`/`shufflePrev`/`bringToFront`; CSS transitions the `transform`/`opacity` between states. **Deliberately uses `translate`+`scale` only, never `rotate`**, on the positioned cards — an earlier version rotated the side cards for a more "fanned" look, but a rotated element's `getBoundingClientRect()` is an axis-aligned box that doesn't match its visual (rotated) shape, so clicks near the visible edge of a tilted card missed the element and hit the container behind it instead. If you want the tilt back, give each card an inner wrapper that carries the rotation so the outer `.shuffle-card` (the click target) stays axis-aligned. Autoplay pauses on hover/focus and is skipped entirely (not just slowed) under `prefers-reduced-motion`, matching the reveal observer's existing `reduceMotion` check.

## Content/asset notes

- `logo.png` is the brand logo with its background made transparent (the original export was an opaque JPEG mislabeled as `.png`); it's referenced by every page's nav and footer. `logo-transparent.png` is kept alongside it as the same processed asset.
- All "Book Now" CTAs across every page point to the same external Phorest booking URL (`https://phorest.com/book/salons/visionsbraidbar`) — treat that as the single source of truth for booking links.
- Several footer/nav links intentionally point to `#` (Booking Terms, Length Guide, Color Guide, Partnerships) because those destination pages don't exist yet. These are deliberate pre-launch placeholders carried over from the original artifact, not broken links to fix.
- The decorative inline SVG artwork in the HTML (braid/cornrow/loc motifs standing in for photography) was generated programmatically rather than hand-authored, but the generator script itself was not committed to this repo — only its output. If you need to regenerate or add similar artwork, you'll be writing that generation logic fresh rather than finding it checked in here.
- `images/` holds real photography pulled from the salon's actual (current, soon-to-be-replaced) Wix site — not stock photos — used on `index.html` for the hero, the about section, and 3 of the 4 homepage service cards: `hero-portrait.jpg`, `about-salon-interior.jpg`, `svc-braids-knotless.jpg`, `svc-twists-locs.jpg`, `svc-specialty.jpg`. The Cornrows service card intentionally still uses its original inline-SVG placeholder — no genuine cornrows photo was available in that Wix export, and nothing was substituted rather than mismatch the content. If real cornrows photography becomes available, wire it into the 3rd `.svc-card-art` on `index.html` the same way the others are done (an `<img>` with `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9` replacing the inline `<svg>`). These same photos could reasonably be reused on `services.html`/`about.html` if those pages' placeholder SVGs are ever swapped too — that hasn't been done yet, only the homepage.
