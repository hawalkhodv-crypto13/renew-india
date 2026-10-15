# Renew India — complete original website

Exact source export of published version 10, including EV Charging and the AC/DC switch.
Source commit: `bdb79f67b311787cc04ba94b0cbc425a58fd2dd9`.

All 871 tracked original files are included byte-for-byte, with their original paths. The website is already built in `dist/`: 180 HTML pages and 659 vehicle JPG images, plus CSS, JavaScript and other assets. No recreation, redesign or regeneration was performed. The currently published website was not changed.

## Upload to GitHub and deploy on Cloudflare Pages

1. Extract this ZIP. Upload or commit its **contents**, keeping `dist/`, `scripts/`, `tests/` and the JSON files together at the repository root. Do not upload only the ZIP itself. GitHub Desktop is convenient for the large number of files.
2. In Cloudflare, create or open a **Pages** project and connect your GitHub repository.
3. Use these settings:
   - Framework preset: **None**
   - Root directory: **repository root** (leave blank)
   - Build command: **`exit 0`**
   - Build output directory: **`dist`**
   - Environment variables: **none required**
4. Deploy. Pages serves `dist/index.html` at `/` and the existing folders at `/explore-evs/`, `/solar/`, `/news/`, `/about/`, `/ev-charging/`, and all vehicle routes.

No npm install, package.json, server, API keys or ChatGPT login are required. Do not run the content-generation scripts during deployment: the supplied `dist/` is the exact finished site. `.openai/hosting.json` is the original hosting metadata, retained for completeness; Cloudflare Pages does not use it. Git history and temporary cache files are not part of this export.

Official deployment instructions: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## Fonts and external links

Original `dist/style.css` is unchanged and still imports DM Sans and Manrope from Google Fonts. This is an internet dependency, **not a ChatGPT dependency**. Supplemental font copies, a local font stylesheet and their licenses are included in `font-assets/`; they do not change the original site's font-loading behaviour. The original site is not fully offline: Google Fonts and outbound manufacturer, government and news links still require internet access.

The old hosting origin appearing in `navigation.js` is only an allowed-origin check for legacy links. Normal navigation uses the current origin and relative routes, so it works on the new Pages domain without editing that file. ChatGPT's hosting access gate is not application code and is not included; configure access on your new host if desired.

## Local preview (optional)

From the extracted project folder, with Python 3 installed:

```
python -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser. Do not double-click HTML files: root-relative routes need a web server. Stop the server with Ctrl+C.

## Verification and maintenance

All supplied local routes, assets and anchors passed validation. Automated checks passed for navigation, gallery interaction, search/filter/comparison, rooftop solar, EV running costs, on-road prices and charging cost/time calculations. Visual browser testing was not available in the export environment. External outbound pages are preserved, but their future availability cannot be guaranteed.

The original maintenance scripts and tests are included. They need Python 3 and Node.js only when you choose to maintain/test the project, not to host it. The Python image validation test additionally uses Pillow; install the optional dependency with `python -m pip install -r requirements-test.txt`.

`ORIGINAL-SHA256SUMS.txt` records every original tracked file. Export-only additions are this README, the checksum list, the optional test dependency file and supplemental font assets. No original file was edited.
