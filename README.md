# Tabula

Tabula is the research website of **Chi-SquareLab** ([github.com/Chi-SquareLab](https://github.com/Chi-SquareLab)), built with Astro, Starlight and MDX. The site opens with a welcome page at `/` — the lab's hero and mission, a conceptual animation, and dated research news — whose **Enter the tutorials** link leads to the documentation Overview at `/overview/`: an introduction to tabular foundation models, a collapsible Quickstart example on Iris, the product directory under **Our products** (grouped into collections), and Next steps cards — rendered with Starlight's native table of contents. Readers open a product from that directory or the sidebar and follow its **Tutorial on the product page**. The catalog currently lists **SurvTFM** (`v0.6.3`, `models`) alongside the **Batch Error** instructional demo (`tasks`, `applications`).

To edit the welcome page or research news, add an article or product, or update a worked example and its notebook, follow the [website editing guide (繁體中文)](docs/code-map.md).

## Run locally

Use Node.js 22.23.4+ and npm. Python is only needed to run the downloadable demos or notebooks.

```sh
npm ci
npm run dev
```

Open the URL printed by Astro. To check the catalog, generate the production pages and preview the search index:

```sh
npm run build
npm run preview
```

## Current catalog

| Product | Collections | Task |
| --- | --- | --- |
| [SurvTFM](src/content/docs/products/survtfm.mdx) | models | Frozen 27.6M-parameter continuous-time tabular survival foundation model and local workspace (`v0.6.3`). |
| [Batch Error](src/content/docs/products/batch-error.mdx) | tasks, applications | Instructional demo: compute a separate mean absolute error for each experimental batch, then average batches equally. |

In the preview, open the Overview at `/overview/` and jump to `#collections`. Follow **Applications → Batch Error**: the sidebar should expand Applications and highlight Batch Error while Tasks stays closed. Reload the page to check that the same branch remains selected. Repeat from **Tasks → Batch Error** to check the other branch. Both entries open the same product tutorial; `?group=` records the entry point. Opening `/products/batch-error/` directly selects its first group in directory order. Collections are display-only: there are no collection pages, and the Our products directory and sidebar link directly to product pages. The old `/collections/<id>/` addresses redirect to `/overview/#collections`, and the old `/quickstart/` page redirects to the Quickstart section of the Overview: deep links to its old sections (`#s0`, `#s1`, `#s2`, `#sources`) land on the same anchors at `/overview/`, everything else lands on `/overview/#quickstart`. Bookmarks from the earlier single-page homepage (`/#quickstart`, `/#our-products`, `/#collections` and the old section anchors) are forwarded from the welcome page to the matching anchors at `/overview/`. The Iris notebook still downloads from `/downloads/quickstart.ipynb`. The Batch Error demo script in [public/demos](public/demos/) uses only the Python standard library; follow the input and command shown on its product page.

## Publish research news

The welcome page's **Research news** section reads [src/data/research-news.json](src/data/research-news.json). Append one object per verified update (`cover` is optional):

```json
{
  "date": "YYYY-MM-DD",
  "kind": "Paper",
  "title": "…",
  "summary": "…",
  "url": "https://…",
  "cover": {
    "src": "/assets/news/example.png",
    "alt": "…",
    "caption": "Fig. 1 · Overview",
    "fit": "contain"
  }
}
```

`date` is `YYYY-MM-DD`, `kind` is a short label such as `Paper`, `Code` or `Tutorial`, and `url` links to the paper, repository or tutorial behind the update (an external `https://` URL or an internal path starting with `/`). The optional `cover` object lets each featured dispatch supply its own image (`src` as a local path under `public/` or an `https://` URL, `alt` text, optional `caption`, and `fit`: `"cover"` default or `"contain"` for uncropped diagrams); omitting `cover` falls back to the default editorial graphic. Entries and local cover paths are validated and sorted newest-first at build time; the newest entry replaces the placeholder preview shown while the array is empty. There is no news client or service — the list is rendered statically at build time.

## Author a product

1. Check the [product protocol](docs/product-protocol.md). Copy the [English template](docs/templates/product.mdx) to `src/content/docs/products/<stable-id>.mdx`. Keep the filename when updating the name or release.
2. Set `collections` to every applicable group ID from the [collection registry](src/data/collection-groups.json) (`models`, `tasks`, `applications`). Membership is recorded only here. Fill in the maintainer, source, release, delivery format and access terms. Set `demo: true` for an instructional demo.
3. In `## Tutorial`, walk through access, a concrete input, the operation and its expected output. Run the example before submitting it. Link supplementary downloads from the same page.
4. Run `npm run check:catalog` to check membership against the registry, metadata, local source paths and tutorial presence. Run `npm run build`, then check the rendered page and its entry under each listed group in the Overview's Our products directory and the sidebar. After changing either included demo, run `python scripts/check-demos.py` to compare the shipped script’s output with its tutorial.

To add a fourth collection, add its ID and label to [src/data/collection-groups.json](src/data/collection-groups.json) in display order, then add the new ID to the relevant products. The sidebar and the Overview's Our products directory derive from the registry and the products’ `collections` field; there is no collection page to write.

## Where to make changes

| Location | Responsibility |
| --- | --- |
| [src/content/docs](src/content/docs/) | The documentation Overview at `/overview/` (including the inline Quickstart), product pages, reference pages, and worked method examples — source files in `reference/`, still served at `/examples/<id>/` through an explicit `slug`. |
| [src/components](src/components/) | Navigation, sidebar, product directory, product details, the reusable worked-example markup, and the welcome page's animation and news components in `welcome/`. |
| [src/content.config.ts](src/content.config.ts), [scripts/check-catalog.mjs](scripts/check-catalog.mjs) | Starlight metadata schema and cross-file catalog checks against the collection registry. |
| [src/data](src/data/), [src/pages](src/pages/) | The welcome page at `/`, collection registry and product grouping, structured mission content (`mission.json`), research news records (`research-news.json`), the shared source for the Quickstart and method examples with their downloadable Python notebooks, and redirects for legacy collection, Quickstart and old homepage bookmark addresses. |
| [public](public/), [src/styles](src/styles/) | Files served unchanged (including Python demos, diagrams, and the Chi-SquareLab mark), and site styles (the Starlight theme plus the standalone welcome page stylesheet). |

## Deploy to GitHub Pages

In **Settings → Pages → Build and deployment**, select **GitHub Actions** when switching from the old root-site deployment. The [Pages workflow](.github/workflows/pages.yml) builds on `main` and deploys **`dist/`** to [chi-squarelab.github.io](https://chi-squarelab.github.io/). No application server is required. Search runs against the Pagefind index created at build time. The [architecture notes](docs/architecture.md) describe the content boundaries; the [project charter](AGENTS.md) records provenance and maintenance decisions.
