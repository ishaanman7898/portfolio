# Portfolio

Personal portfolio for Ishaan Manoor. It is a single static page with no build step.

## Files

`index.html` holds all the content, including a TradingView ticker tape under the hero. `style.css` handles the light green theme, the two column hero with a photo slot, and the experience and work layouts, which collapse to one column on phones. `script.js` fades each section in as it scrolls into view.

## Editing

Jobs are `<article class="job">` blocks and projects are `<article class="card">` blocks. Copy one and change the text to add a new entry. To add your photo, replace the contents of the `.slot.photo` box with an `<img>`. After changing `style.css` or `script.js`, bump the `?v=` number on their tags in `index.html` so browsers fetch the new file instead of a cached one.

## Running locally

Open `index.html` in a browser, or serve the folder with any static server such as `python3 -m http.server`.

Docs: [TradingView ticker tape widget](https://www.tradingview.com/widget-docs/widgets/tickers/ticker-tape/), [Python http.server](https://docs.python.org/3/library/http.server.html)

## Deployment

Every push to `main` runs `.github/workflows/pages.yml`, which publishes the repo root to GitHub Pages. In the repo settings under Pages, the source has to be set to GitHub Actions once. The site then lives at https://ishaanman7898.github.io/portfolio/.

Docs: [Publishing with a custom GitHub Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
