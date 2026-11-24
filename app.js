"use strict";
const paths = {
  menu: "M3 6h18M3 12h18M3 18h18",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 1 1 16 0",
  book: "M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2zM12 6v15",
  terminal: "M3 4h18v16H3zM6 9l3 3-3 3m6 0h5",
  layers: "m2 8 10-5 10 5-10 5zM2 12l10 5 10-5M2 16l10 5 10-5",
  chart: "M3 3v17h18M6 16c5 0 3-10 7-10s3 9 7 9",
  flask: "M9 3h6m-5 0v7L4 19q-1 2 1 2h14q2 0 1-2l-6-9V3M7 15h10",
  nodes: "M8 2h8v5H8zM2 17h7v5H2zM15 17h7v5h-7zM12 7v5m-7 5v-5h14v5",
  library: "M3 3h4v17H3zM10 3h4v17h-4zM16 5l3-1 4 15-3 1z",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  right: "m9 6 6 6-6 6",
  code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18",
  copy: "M8 8h12v13H8zM16 8V3H3v14h5",
  down: "M12 2v13m-5-5 5 5 5-5M4 16v5h16v-5",
  home: "m2 10 10-8 10 8M5 9v12h14V9M10 21v-7h4v7",
  file: "M5 2h9l5 5v15H5zM14 2v6h5",
};
const icon = (n) =>
  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[n]}"/></svg>`;
function markup(el, html) {
  el.replaceChildren(DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true }));
}
document
  .querySelectorAll("[data-i]")
  .forEach((el) => markup(el, icon(el.dataset.i)));
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const collections = [
  {
    id: "domain",
    name: "Domain TFMs",
    desc: "Explore domain-specific tabular foundation models and test how well they transfer to a new site.",
    alt: "Layered feature tables representing domain-specific measurements.",
  },
  {
    id: "statistics",
    name: "Statistical Tasks",
    desc: "Build prediction intervals and examine the uncertainty around model predictions.",
    alt: "Density curve with an interval marked on the response axis.",
  },
  {
    id: "science",
    name: "Scientific Tasks",
    desc: "Model experimental responses and evaluate predictions across held-out batches.",
    alt: "A schematic response surface over experimental conditions.",
  },
];
const pages = [
  ["overview", "Homepage", "Introduction and tutorial collections"],
  ["quickstart", "Quickstart", "Fit a TabPFN classifier on Iris"],
  ...collections.map((c) => [c.id, c.name, c.desc]),
  [
    "architecture",
    "Model architecture",
    "Context, query rows, and predictions",
  ],
  ["references", "Reading list", "Methods and software documentation"],
];
const quick = `from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom tabpfn import TabPFNClassifier\n\nX, y = load_iris(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42\n)\n\nmodel = TabPFNClassifier()\nmodel.fit(X_train, y_train)\nprobabilities = model.predict_proba(X_test)`;
const extra = {
  quickstart: {
    title: "Quickstart",
    intro:
      "Use TabPFN to predict iris species from four flower measurements. This example walks through a complete classification call on a dataset included with scikit-learn.",
    sections: [
      {
        title: "Prepare the environment",
        text: "Install tabpfn==9.0.0 and scikit-learn in a Python environment compatible with the package. The first model load needs access to the corresponding weights; follow the TabPFN documentation for licensing, credentials and hardware requirements.",
      },
      {
        title: "Fit and predict",
        text: "The stratified split preserves class representation. Only the training features and labels are passed to fit; each output row from predict_proba follows the ordering in model.classes_.",
        code: quick,
      },
      {
        title: "Inspect the output",
        text: "Check the probability matrix against the held-out rows. A probability vector describes one prediction; assessing calibration requires more than inspecting a single vector.",
        code: "print(model.classes_)\nprint(probabilities.shape)\nprint(probabilities[0])",
      },
    ],
    sources: [
      {
        label: "TabPFN · official implementation",
        url: "https://github.com/PriorLabs/TabPFN",
      },
      {
        label: "scikit-learn · Iris dataset",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html",
      },
    ],
  },
  architecture: {
    title: "Model architecture",
    intro:
      "Read an in-context prediction as a mapping from a labelled reference table and new feature rows to a predictive output.",
    sections: [
      {
        title: "Context and query rows",
        text: "Each context row pairs feature values with a known target. Query rows have the same feature schema, with the target withheld. Feature units, order and categorical encodings must agree between the tables.",
      },
      {
        title: "A shared predictor",
        text: "A pretrained tabular predictor uses the context to interpret the query. In a scikit-learn interface, fit supplies the labelled context and predict or predict_proba requests outputs. The diagram shows information flow; internal attention layouts depend on the model and version.",
      },
      {
        title: "Read the prediction",
        text: "For classification, predict_proba returns a score for each class. For regression, predict returns a numerical response. Hold out data that match the intended deployment setting before evaluating either output.",
      },
    ],
    sources: [
      {
        label: "TabPFN · implementation and model documentation",
        url: "https://github.com/PriorLabs/TabPFN",
      },
    ],
  },
};
const refs = [
  {
    label: "TabPFN",
    url: "https://github.com/PriorLabs/TabPFN",
    note: "Implementation, checkpoint access, and estimator documentation.",
  },
  {
    label: "TabICL",
    url: "https://github.com/soda-inria/tabicl",
    note: "An additional implementation of in-context learning for tables.",
  },
  {
    label: "scikit-learn · cross-validation",
    url: "https://scikit-learn.org/stable/modules/cross_validation.html",
    note: "Split design for grouped observations and independent test sets.",
  },
];
let codes = [];
const content = document.querySelector("main");
function highlight(line) {
  return line
    .split(
      /(#[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:from|import|as|if|else|for|in|def|return|assert|True|False|None|print|[A-Z][a-zA-Z0-9_]+|\d+(?:\.\d+)?)\b)/g,
    )
    .map((s, i) => {
      if (i % 2 === 0) return esc(s);
      const cls =
        s[0] === "#"
          ? "comment"
          : /["']/.test(s[0])
            ? "str"
            : /^\d/.test(s)
              ? "num"
              : /^[A-Z]/.test(s)
                ? "name"
                : "kw";
      return `<span class="${cls}">${esc(s)}</span>`;
    })
    .join("");
}
function codeBox(src, name) {
  let id = codes.push(src) - 1;
  return `<div class="codebox"><div class="codebar"><span class="filename">${icon("file")}${esc(name)}</span><button class="copy" data-copy="${id}">${icon("copy")}<span aria-live="polite">Copy</span></button></div><pre tabindex="0"><code>${src
    .split("\n")
    .map(
      (l, i) =>
        `<span class="ln" aria-hidden="true">${i + 1}</span>${highlight(l)}`,
    )
    .join("\n")}</code></pre></div>`;
}
function crumbs(name) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#overview" aria-label="Documentation home">${icon("home")}</a>${icon("right")}<a href="#overview">Tutorials</a>${icon("right")}<b>${esc(name)}</b></nav>`;
}
function landing() {
  return `${crumbs("Homepage")}<div class="hero"><div><div class="eyebrow">RESEARCH HANDBOOK</div><h1>Tabular Foundation Models<br> for Statistics &amp; Science</h1><p class="lead">A practical guide to domain-specific models, statistical inference, and scientific discovery with tabular data.</p><div class="actions"><a class="btn primary" href="#overview/collections">Explore collections ${icon("arrow")}</a><a class="btn" href="#quickstart">${icon("terminal")} Quickstart</a></div></div><a href="#architecture" aria-label="Read the model architecture notes"><img src="assets/context.svg" alt="In-context prediction diagram"></a></div><section class="block" id="collections"><div class="section-head"><h2>Tutorial collections</h2><span class="section-count">03 COLLECTIONS</span></div><p class="subtitle">Choose a research direction to explore its methods and worked examples.</p><div class="cards">${collections.map((c, i) => `<a class="card ${c.id}" href="#${c.id}"><div class="art"><img src="assets/${c.id}.svg" alt="${c.alt}"></div><div class="card-body"><span class="card-label">COLLECTION 0${i + 1}</span><h3>${c.name}</h3><p>${c.desc}</p><span class="card-link">Open collection ${icon("arrow")}</span></div></a>`).join("")}</div></section><section class="block" id="example"><div class="section-head"><h2>A first prediction</h2><span class="section-count">PYTHON EXAMPLE</span></div><p class="subtitle">Fit a pretrained classifier and predict class probabilities on held-out Iris measurements.</p>${codeBox(quick, "first_prediction.py")}<a class="text-link" href="#quickstart">See setup and output guide →</a></section>`;
}
function article(id, doc) {
  const idx = collections.findIndex((c) => c.id === id);
  const group =
    idx < 0
      ? "MODEL NOTES"
      : `COLLECTION 0${idx + 1} / ${idx === 0 ? "DOMAIN-SPECIFIC TABULAR FOUNDATION MODELS" : collections[idx].name.toUpperCase()}`;
  return `${crumbs(pages.find((p) => p[0] === id)[1])}<div class="doc-layout"><article class="doc"><div class="eyebrow">${id === "quickstart" ? "GETTING STARTED" : group}</div><h1>${esc(doc.title)}</h1><p class="intro">${esc(doc.intro)}</p>${doc.sections.some((s) => s.code) ? `<div class="actions"><button class="btn" data-notebook="${id}">${icon("down")}Download notebook</button></div>` : ""}${id === "architecture" ? '<img class="figure" src="assets/context.svg" alt="Labelled context rows and unlabelled query features enter the model, which returns a prediction.">' : ""}${doc.sections.map((s, i) => `<section><h2 id="s${i}">${esc(s.title)}</h2><p>${esc(s.text)}</p>${s.code ? codeBox(s.code, `In [${doc.sections.slice(0, i + 1).filter((s) => s.code).length}] · Python`) : ""}</section>`).join("")}<h2 id="sources">Sources</h2><ul class="sources">${doc.sources.map((s) => `<li><a href="${esc(s.url)}">${esc(s.label)} ↗</a></li>`).join("")}</ul></article><nav class="toc" aria-label="On this page"><span class="micro">ON THIS PAGE</span>${doc.sections.map((s, i) => `<a href="#${id}/s${i}">${esc(s.title)}</a>`).join("")}<a href="#${id}/sources">Sources</a></nav></div>`;
}
function closeMenu() {
  document.body.classList.remove("nav-open");
  document.querySelector("#shade").hidden = true;
  document.querySelector("#menu").setAttribute("aria-expanded", "false");
}
function render() {
  let [id, part] = location.hash.slice(1).split("/");
  if (!pages.some((p) => p[0] === id)) id = "overview";
  codes = [];
  closeMenu();
  const doc = extra[id] || window.TUTORIALS?.[id];
  const label = pages.find((p) => p[0] === id)[1];
  document.title = `${label} · Tabula`;
  let core =
    id === "overview"
      ? landing()
      : doc
        ? article(id, doc)
        : id === "references"
          ? `${crumbs(label)}<article class="doc"><div class="eyebrow">REFERENCE</div><h1>Reading list</h1><p class="intro">Start with the upstream implementations and evaluation guides used in these tutorials.</p>${refs.map((s) => `<h2><a class="text-link" href="${s.url}">${s.label} ↗</a></h2><p>${s.note}</p>`).join("")}</article>`
          : `<p>Tutorial content could not be loaded. Reload the page to try again.</p>`;
  markup(
    content,
    `<div class="page">${core}<footer class="footer"><span>Tabula · Research handbook</span><a href="#overview">Homepage ↑</a></footer></div>`,
  );
  const inCollections = collections.some((c) => c.id === id) ||
    (id === "overview" && part === "collections");
  const sectionLink = inCollections ? "#overview/collections"
    : ["architecture", "references"].includes(id) ? "#architecture" : "#quickstart";
  document.querySelectorAll("aside nav a, .headnav a").forEach((a) => {
    const topLevel = a.closest(".headnav");
    const on = a.hash === (topLevel ? sectionLink : "#" + id);
    a.classList.toggle("on", on);
    if (on) a.setAttribute("aria-current", topLevel ? "location" : "page");
    else a.removeAttribute("aria-current");
  });
  if (part && document.getElementById(part))
    document.getElementById(part).scrollIntoView();
  else window.scrollTo(0, 0);
}
function notebook(id) {
  const d = extra[id] || window.TUTORIALS[id];
  const md = (s) => ({ cell_type: "markdown", metadata: {}, source: [s] });
  const cells = [md(`# ${d.title}\n\n${d.intro}`)];
  d.sections.forEach((s) => {
    cells.push(md(`## ${s.title}\n\n${s.text}`));
    if (s.code)
      cells.push({
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [s.code],
      });
  });
  cells.push(
    md(
      "## Sources\n\n" +
        d.sources.map((s) => `- [${s.label}](${s.url})`).join("\n"),
    ),
  );
  const url = URL.createObjectURL(
    new Blob(
      [
        JSON.stringify(
          {
            cells,
            metadata: {
              kernelspec: {
                display_name: "Python 3",
                language: "python",
                name: "python3",
              },
            },
            nbformat: 4,
            nbformat_minor: 4,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    ),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `tabula-${id}.ipynb`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
content.addEventListener("click", async (e) => {
  const copy = e.target.closest("[data-copy]"),
    book = e.target.closest("[data-notebook]");
  if (book) notebook(book.dataset.notebook);
  if (copy) {
    const span = copy.querySelector("span");
    try {
      await navigator.clipboard.writeText(codes[copy.dataset.copy]);
      span.textContent = "Copied";
    } catch {
      span.textContent = "Select code to copy";
    }
    setTimeout(() => (span.textContent = "Copy"), 2000);
  }
});
const dialog = document.querySelector("dialog"),
  query = document.querySelector("#query"),
  results = document.querySelector("#results");
function findPages() {
  let q = query.value.toLowerCase().trim();
  const matches = pages.filter((p) =>
    [...p, window.TUTORIALS?.[p[0]]?.title || ""]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
  markup(
    results,
    matches
      .map(
        ([id, title, desc]) =>
          `<a href="#${id}">${esc(title)}<small>${esc(desc)}</small></a>`,
      )
      .join("") || "<p>No matching pages.</p>",
  );
}
function search() {
  if (!dialog.open) dialog.showModal();
  query.value = "";
  findPages();
  query.focus();
}
query.addEventListener("input", findPages);
query.addEventListener("keydown", (e) => {
  if (e.key === "Enter") results.querySelector("a")?.click();
  if (e.key === "ArrowDown") {
    e.preventDefault();
    results.querySelector("a")?.focus();
  }
});
results.addEventListener("click", (e) => {
  if (e.target.closest("a")) dialog.close();
});
document.querySelector("#search-open").onclick = search;
document.querySelector("#close-search").onclick = () => dialog.close();
dialog.onclick = (e) => {
  if (e.target === dialog) dialog.close();
};
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    search();
  }
  if (e.key === "Escape") closeMenu();
});
document.querySelector("#menu").onclick = () => {
  if (document.body.classList.contains("nav-open")) closeMenu();
  else {
    document.body.classList.add("nav-open");
    document.querySelector("#shade").hidden = false;
    document.querySelector("#menu").setAttribute("aria-expanded", "true");
  }
};
document.querySelector("#shade").onclick = closeMenu;
document.querySelector("aside nav").onclick = closeMenu;
document.querySelector(".skip").onclick = (e) => {
  e.preventDefault();
  content.focus();
};
window.addEventListener("hashchange", () => {
  render();
  content.focus({ preventScroll: true });
});
render();
