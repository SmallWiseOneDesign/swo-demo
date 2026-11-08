# Staging QA: Portfolio and Collaboration

Validated on November 8, 2026 (ET), using headless Chromium at the `/swo-demo/` project base path.

- All five pages checked at 1280px desktop and 390px mobile: no HTTP/JavaScript errors, broken image/nav links, horizontal overflow, or external runtime requests. Local Open Sauce loaded. Required demo banner, noindex, and white html/body/header/main/section/wrapper backgrounds verified.
- Portfolio has 71 artworks in eight mockup-ordered categories; all optimized JPEGs have a 1600px long side (quality 82). Original downloads are outside the repository. No ZIP included.
- Lightbox checked at desktop and mobile: open, close button, previous/next, arrow keys, wraparound, Escape, focus containment, and focus restoration. An initial focus-cycle test found Chromium could move focus outside the controls at the Tab boundary; explicit Tab/Shift+Tab wrapping was added and the tests then passed.
- Additional Portfolio/Collaboration overflow checks passed at 320, 700, 768, 1024, and 1440px. With JavaScript disabled, a thumbnail opened its full-size JPEG.
- Desktop and mobile screenshots visually reviewed: populated galleries, white backgrounds, shared nav/banner, Collaboration rabbit, and all five matching bottom artworks. No missing-asset fallbacks. Regents Park is the matching Queen Mary’s Rose Garden drawing.
- Home/About/Contact HTML unchanged. No CNAME, analytics, CDN, spend, merge, or production changes.

Review screenshots on the box:
- `/workspace/swo/screenshots/screenshot-portfolio.png`
- `/workspace/swo/screenshots/screenshot-collaboration.png`
- `/workspace/swo/screenshots/screenshot-portfolio-mobile.png`
- `/workspace/swo/screenshots/screenshot-collaboration-mobile.png`

Detailed local QA results: `/workspace/swo/qa-complete-results.json`. Screenshots and test tooling are not deployment files.

Deferred: final SEO/sitemap and production promotion. The feature branch is review-only until Mark merges.

## Iterative update: home prefetch and contact mail (November 8, 2026)

- Home page loads a small script that waits for the `load` event, then fetches the Portfolio page and warms the browser cache for each gallery JPEG so those images are less likely to stream in on the next visit to Portfolio.
- Contact no longer includes a raw `mailto:hello@smallwiseone.com` in the HTML. JavaScript assembles the visible `hello@smallwiseone.com` address and sets the mailto to `hello+web` plus the current year (2026 now). Without JavaScript the page shows `hello [at] smallwiseone [dot] com` and is not a harvestable mailto.
- No production, CNAME, or mailbox-local-part change. Staging only.

## Iterative update: Microsoft Clarity (November 8, 2026)

- Exact Clarity snippet supplied by Mark (project id `p1ucc2kgen`) is in the `<head>` of every HTML page (Home, Portfolio, Collaboration, About, Contact). Staging only; no production, CNAME, or project-id change.
