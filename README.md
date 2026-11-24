# Tabula

Tabula is the tutorial site for [statlabx.github.io](https://statlabx.github.io/). The current version is a static HTML, CSS, and JavaScript site. It runs in the browser without a package install, build step, model weights, or backend.

## Run locally

From the repository root, start a local server with Python 3:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173/>. Refresh after editing a file; stop the server with `Ctrl+C`. Python serves the files only. Readers run downloaded notebooks in their own Python environments using the setup instructions in each tutorial.

## Where to make changes

| File | What it controls |
| --- | --- |
| [index.html](index.html) | Page shell, top navigation, sidebar links, and search dialog. |
| [app.js](app.js) | Hash routing, page titles, search, homepage cards, Quickstart, model notes, reading list, and notebook downloads. |
| [tutorials.js](tutorials.js) | Collection tutorials: titles, prose, ordered Python examples, and sources. Both the article and its notebook use these records. |
| [style.css](style.css) | Layout, typography, navigation states, and responsive styles. |
| [assets/](assets/) | Local illustrations and the vendored DOMPurify script with its license. |

To revise a collection example, edit its section in `tutorials.js`, open the article, and download its notebook to check the cell order and sources. To add a collection, also register its route and card in `app.js` and add its sidebar link in `index.html`. Preserve existing hash links such as `#domain`, `#statistics`, and `#science` when renaming labels.

## Check and publish

1. Run `node --check app.js` and `node --check tutorials.js` if Node.js is installed.
2. In the local preview, follow each top navigation link, open a collection from search, reload a direct hash URL, and download a notebook. Check the sidebar on a narrow viewport after changing navigation or CSS.
3. Push the reviewed changes to `main`. The prototype is served from the repository root by GitHub Pages. Keep `index.html`, `style.css`, both scripts, and `assets/` in their relative locations. Check the [deployment run](https://github.com/StatLabX/statlabx.github.io/actions) and the [published site](https://statlabx.github.io/) after pushing.

The [architecture notes](docs/architecture.md) describe the planned Astro and Starlight migration; that toolchain is not needed to work on this version. See the [project charter](AGENTS.md) for content provenance and maintenance decisions.
