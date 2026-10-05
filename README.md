# Portfolio

Personal portfolio for Ishaan Manoor. It is a single static page with no build step.

## Files

`index.html` holds all the content. `style.css` handles the black and white theme and the two column layout, which stacks into one column on small screens. `script.js` highlights the sidebar link for the section in view.

## Editing

Experience and projects are `<li class="item">` blocks. Copy one and change the text to add a new entry. Add an `<a class="cover">` inside an item to make the whole card a link.

## Running locally

Open `index.html` in a browser, or serve the folder with any static server such as `python3 -m http.server`.

Docs: [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme), [Python http.server](https://docs.python.org/3/library/http.server.html)

## Deployment

Every push to `main` runs `.github/workflows/pages.yml`, which publishes the repo root to GitHub Pages. In the repo settings under Pages, the source has to be set to GitHub Actions once. The site then lives at https://ishaanman7898.github.io/portfolio/.

Docs: [Publishing with a custom GitHub Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
