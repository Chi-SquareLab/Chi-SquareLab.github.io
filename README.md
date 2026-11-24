# Tabula

Tabula is a static research product catalog built with Astro, Starlight and MDX. Readers choose a collection, open a product, and follow its **Tutorial on the product page**. The sample catalog contains two working Python scripts for instructional use, not published research packages or trained models.

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

## Try the demos

| Product | Collections | Task |
| --- | --- | --- |
| [Cooling Context](src/content/docs/products/cooling-context.mdx) | Domain TFMs | Prepare labeled context and unlabeled query rows from cooling measurements. |
| [Batch Error](src/content/docs/products/batch-error.mdx) | Statistical Tasks, Scientific Tasks | Compute a separate mean absolute error for each experimental batch, then average batches equally. |

In the preview, open `/collections/statistics/` or `/collections/science/`. Both list `/products/batch-error/`. Its `#tutorial` anchor opens the first-use instructions. The two CLI tools in [public/demos](public/demos/) use only the Python standard library; follow the input and command shown on each product page.

## Author a product

1. Check the [product protocol](docs/product-protocol.md). Copy the [English template](docs/templates/product.mdx) to `src/content/docs/products/<stable-id>.mdx`. Keep the filename when updating the name or release.
2. Set `collections` to every applicable [collection ID](src/content/docs/collections/) (the filename without `.mdx`). Membership is recorded only here. Fill in the maintainer, source, release, delivery format and access terms. Set `demo: true` for an instructional demo.
3. In `## Tutorial`, walk through access, a concrete input, the operation and its expected output. Run the example before submitting it. Link supplementary downloads from the same page.
4. Run `npm run check:catalog` to check membership, metadata, local source paths and tutorial presence. Run `npm run build`, then check the rendered page from each listed collection. After changing either included demo, run `python scripts/check-demos.py` to compare the shipped script’s output with its tutorial.

To add a fourth collection, add its English introduction in `src/content/docs/collections/` using an existing entry as a pattern, then add its ID to the relevant products. The sidebar and product lists derive from the content collection.

## Where to make changes

| Location | Responsibility |
| --- | --- |
| [src/content/docs](src/content/docs/) | Homepage, collection definitions, product pages, Quickstart and reference pages. |
| [src/components](src/components/) | Navigation, collection cards, product details and reusable article markup. |
| [src/content.config.ts](src/content.config.ts), [scripts/check-catalog.mjs](scripts/check-catalog.mjs) | Starlight metadata schema and cross-file catalog checks. |
| [src/data](src/data/), [src/pages/downloads](src/pages/downloads/) | Shared source for the original method examples and their downloadable Python notebooks. |
| [public](public/), [src/styles](src/styles/) | Files served unchanged (including Python demos and diagrams), and site styles. |

## Deploy to GitHub Pages

In **Settings → Pages → Build and deployment**, select **GitHub Actions** when switching from the old root-site deployment. The [Pages workflow](.github/workflows/pages.yml) builds on `main` and deploys **`dist/`** to [statlabx.github.io](https://statlabx.github.io/). No application server is required. Search runs against the Pagefind index created at build time. The [architecture notes](docs/architecture.md) describe the content boundaries; the [project charter](AGENTS.md) records provenance and maintenance decisions.
