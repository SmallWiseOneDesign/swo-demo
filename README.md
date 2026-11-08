# Small Wise One staging demo

This is the staging/demo site, not production. The production site and its settings are not changed by this repository.

- Intended GitHub Pages URL: https://smallwiseonedesign.github.io/swo-demo/
- Project Pages base path: `/swo-demo/`. All internal navigation, images, and fonts use relative URLs.
- Publishing source: `main`, repository root. The first-slice feature branch remains unpublished until Mark reviews and merges its PR.
- Every page carries the required demo banner and uses a pure white background, including Contact.

## First slice

Plain HTML and CSS: Home, About, Contact, and minimal Portfolio and Collaboration placeholders. Contact is mailto-only. No build step, JavaScript, analytics, forms, newsletter, or third-party font requests.

Home uses three starter featured artworks. About uses both the artist portrait and circular supporting artwork. Contact uses starter featured art rather than reproducing the additional mockup illustrations that are not in the provided asset subset.

Deferred: the full eight-collection portfolio, lightbox, Collaboration content, final SEO/sitemap, production promotion and rollback workflow. Demo pages are marked noindex.

## Local preview at the correct base path

From a parent folder containing this checkout as `swo-demo`:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/swo-demo/`. If your checkout has another name, create a symlink called `swo-demo` in a separate preview directory. Do not serve just the repository root when checking project-path navigation.

## Fonts and source assets

Open Sauce One by Alfredo Marco Pradil is self-hosted in `assets/fonts/` under SIL OFL 1.1. The complete license is `assets/fonts/OFL.txt`.

Upstream: https://github.com/marcologous/Open-Sauce-Fonts

Vendored revision: `1747e4467caf9ecce17690ae6880d86a03e17c41`. Regular, Medium, SemiBold, and Italic TTF files are unmodified. Artwork, logos, and copy were supplied in the Small Wise One source pack; their inclusion is not a general license to reuse them.

## Production remains separate

Promotion to `SmallWiseOneDesign/smallwiseone.github.io` is a later, separately reviewed PR after Mark and Loretta approve. Never add a CNAME to this demo repository or change production Pages settings. This PR must not be merged automatically.
