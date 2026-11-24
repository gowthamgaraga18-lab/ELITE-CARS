# Elite Motors — Premium Automotive Showroom

A single-page premium automotive showroom for Vijayawada: a filterable collection of
ten cars, a comparison table, test-drive and contact forms, a journal and full
responsive/motion handling. Plain HTML, CSS and vanilla JavaScript — no build step,
no dependencies, no backend.

## Run locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly from the filesystem also works.

## Structure

```
index.html            page shell, icon sprite, all section markup
styles.css            design system, layout and responsive rules
assets/js/data.js     the ten cars, the articles, formatting helpers (window.EM)
assets/js/app.js      collection filtering/sorting, compare table, modals, forms
assets/img/           photography and the favicon
```

## What it does

- **Collection** — live search, body-style and marque chips, budget slider, condition
  filter, four sort orders, empty state, and a filter count badge.
- **Compare** — up to three cars; rows that differ are highlighted, identical rows can be
  hidden, each numeric row gets a best-in-class bar, and the shortlist persists in
  `localStorage`.
- **Vehicle detail** — a modal with a three-shot gallery (arrows, thumbnails, swipe and
  keyboard), specifications, features, indicative finance and a sticky action bar.
- **Forms** — test-drive booking, contact and two newsletter forms with real validation,
  a generated booking reference, copy-to-clipboard and a saved-request history.
- **Motion** — preloader, hero parallax, scroll reveals, animated counters, marquee,
  scroll-spy, plus a full `prefers-reduced-motion` path.

## Deployment

The site is published by GitHub Pages straight from the `gh-pages` branch, which
mirrors the repository root — no build step, no workflow:

- **Settings → Pages → Source:** *Deploy from a branch* → `gh-pages` / `/ (root)`
- Live at <https://gowthamgaraga18-lab.github.io/ELITE-CARS/>

After changing `index.html`, `styles.css` or `assets/`, update the published branch:

```bash
git checkout gh-pages        # or: git push origin main:gh-pages
git merge main               # fast-forward the published tree
git push origin gh-pages     # Pages rebuilds in ~30s
```

`.nojekyll` is present so the static files are served untouched. `404.html` handles
deep links.

## Notes

This is a demonstration site. Form submissions are validated and stored in the
visitor's browser only; nothing is transmitted. Vehicle names and marques belong to
their respective owners, and the photography is AI-generated for this demo.
Prices, specifications and EMI figures are indicative and non-binding.
