# 程式碼導讀（code map）

本頁寫給要讀或改這個網站的程式設計師：先沿目錄樹逐層看每個檔案的職責與依賴，再用兩條走讀把資料流走一遍。撰稿與收錄規則在[內容架構](architecture.md)，日常指令與部署在[開發者 README](../README.md)。

## 引用方式圖例

看樹時問兩件事：這個檔案從哪裡取得資料？誰使用它的輸出？有時答案是一行 `import`，有時要看框架設定或頁面上的下載連結。

- **匯入**：原始碼裡的 `import`，改路徑要同時改兩端。
- **框架載入**：[astro.config.mjs](../astro.config.mjs) 的註冊（Starlight 元件覆寫、樣式、sidebar）或 [src/content.config.ts](../src/content.config.ts) 的 loader。檔名不出現在匯入端，容易漏改。
- **內容查詢**：元件以 `getCollection('docs', …)` 在建置期依 `id` 前綴或 frontmatter 欄位篩選 MDX，不是匯入。
- **靜態網址**：`public/` 內容原樣複製進 `dist/`，以 `/assets/…`、`/demos/…` 引用。
- **建置／CI**：npm scripts、檢查腳本與 GitHub Actions 的呼叫順序。

## 目錄樹

版控中的每個檔案都在樹上（含本頁）；生成目錄見文末。

- **根目錄**
  - [package.json](../package.json) — 指令與相依：`dev`、`build`（先跑 check-catalog 再 `astro build`）、`preview`、`check:catalog`；Node ≥ 22.23.4。被讀：開發者與 CI。
  - [package-lock.json](../package-lock.json) — 相依版本鎖定，讓 CI 的 `npm ci` 重現安裝。
  - [astro.config.mjs](../astro.config.mjs) — 網站骨架：靜態輸出、KaTeX（remark-math＋rehype-katex）、Tailwind Vite 外掛、React 整合，以及 Starlight 設定——favicon `/assets/atlas.svg`、customCss（katex＋兩個本地樣式）、sidebar（頂層依序為連到 `/` 的 Overview、保持空 items 的 Collections 段——實際分組由 Sidebar 覆寫填入——與 Reference 兩頁）、把 `Header`、`MarkdownContent` 與 `Sidebar` 覆寫指向 `src/components/`。被讀：`astro dev/build/preview`。
  - [tsconfig.json](../tsconfig.json) — Astro strict 基底加 React JSX 設定，供編輯器與型別檢查。
  - [.gitignore](../.gitignore) — 排除生成物、環境與 Python 快取。
  - [README.md](../README.md) — 開發者指南（英文）：預覽、撰稿、驗證、部署；開頭連到本頁。
  - [AGENTS.md](../AGENTS.md) — 研究章程與維護決策（中文）；第 9 節要求檔案異動時同步更新本導讀。
- **.github/workflows/**
  - [pages.yml](../.github/workflows/pages.yml) — 「Publish Tabula」工作流程：`main` 推送或手動觸發；`npm ci` → `npm run build`（含型錄檢查）→ `python3 scripts/check-demos.py` → 上傳 `dist/` → 部署到 GitHub Pages（chi-squarelab.github.io）。
- **docs/** — 維護文件，不參與建置
  - [architecture.md](architecture.md) — 內容架構：讀者路徑、分類與產品檔的撰稿規則。
  - [product-protocol.md](product-protocol.md) — 產品定位與分類判準（什麼算產品、歸哪幾類）。
  - [templates/product.mdx](templates/product.mdx) — 新產品英文範本，複製到 `src/content/docs/products/` 後填寫。
  - `code-map.md` — 本頁；由 README、architecture.md 與 AGENTS.md 連入。
- **scripts/** — 建置期檢查
  - [check-catalog.mjs](../scripts/check-catalog.mjs) — 跨檔編輯檢查：先驗證 `src/data/collection-groups.json` 的分組 id 與 label（格式、不重複、有標籤），再逐產品檢查 ID 格式、必填欄位、`collections` 指向登記檔內的分組且不重複、`source` 是 `public/` 內實際存在的檔案或 HTTP(S) 網址、恰一個 `## Tutorial` 且含步驟。讀：`src/data/collection-groups.json`、`src/content/docs/products/`、`public/`（直接讀檔案系統，不經 Astro）。被讀：package.json 的 `build` 與 `check:catalog`。
  - [check-demos.py](../scripts/check-demos.py) — 建置後執行：從兩個產品頁的 `csv`／`json` 圍欄取出輸入與預期輸出，實際執行 `dist/demos/<demo>.py` 比對 JSON 是否一致。讀：`src/content/docs/products/*.mdx`、`dist/demos/*.py`。被讀：CI 工作流程。
- **src/** — 網站原始碼
  - [content.config.ts](../src/content.config.ts) — 定義兩個 collection：`docs`（docsLoader 載入 `src/content/docs/`，schema 擴充 `collections`、`delivery`、`maintainer`、`source`、`status`、`release`、`access`、`demo` 欄位）與 `i18n`（i18nLoader）。載入：Astro 內容層自動讀取。
  - **components/** — 區塊與互動元件
    - [Header.astro](../src/components/Header.astro) — 覆寫 Starlight 頁首：品牌、三個區段連結（Overview→`/`、Collections→`/#collections`、Reference）、搜尋與主題切換；頁內 `<script>` 匯入 legacy-bookmarks，在首頁依 hash 同步導覽（`#collections` 與 `#our-products` 視為目錄區段）並把舊書籤轉址。載入：astro.config.mjs 的 `components.Header`。
    - [DocContent.astro](../src/components/DocContent.astro) — 覆寫 Starlight 的 MarkdownContent：`products/` 開頭的頁面在正文前插入 ProductDetails，其餘照常渲染。載入：astro.config.mjs 的 `components.MarkdownContent`。
    - [Sidebar.astro](../src/components/Sidebar.astro) — 覆寫 Starlight 側欄：沿設定檔的 sidebar 段渲染，頂層連到 `/` 的 Overview 加圖示與專用樣式；`Collections` 段不用設定檔 items，改以 getProductGroups() 依登記檔順序列出分組標籤與產品直連（`/products/<id>/`；首次進入首頁時預設收合；進入產品頁後，側欄只展開並標示目前產品所在的一組），其餘段交回 Starlight 的 SidebarSublist；自帶側欄樣式。讀：src/data/product-groups.ts。載入：astro.config.mjs 的 `components.Sidebar`。
    - [ProductDirectory.astro](../src/components/ProductDirectory.astro) — 首頁「Our products」區段的目錄本體：按 getProductGroups() 分組渲染各組標題與產品連結（多組產品帶 `?group=`）及描述，空組顯示佔位文字；區段 H2 與 `#collections` 別名錨點由 index.mdx 提供。被讀：index.mdx 匯入。
    - [ProductDetails.astro](../src/components/ProductDetails.astro) — 產品頁的事實卡：維護者、版本、交付、存取，所屬分組由 `data.collections` 對照登記檔標籤後以純文字標籤顯示（分組沒有頁面可連），並把 `source` 轉成下載鈕（`/` 開頭路徑下載、`http` 開頭開外部連結）。讀：src/data/collection-groups.json。被讀：DocContent。
    - [LegacyArticle.astro](../src/components/LegacyArticle.astro) — 把 `legacyArticles[id]`（型別排除 quickstart）渲染成完整文章：開頭示範案例聲明、自帶目錄、章節（`s0`… 錨點）、程式碼格、來源清單與 `.ipynb` 下載鈕（連到 `/downloads/<id>.ipynb`）。讀：src/data/legacy-articles.ts。被讀：examples/ 三頁匯入；Quickstart 紀錄改由首頁 index.mdx 內嵌渲染。
    - [BatchErrorPlot.tsx](../src/components/BatchErrorPlot.tsx) — React 互動圖：滑桿改 batch B 的預測值，d3-scale 換算長度、GSAP 補間寬度，尊重 reduced-motion。讀：`./BatchErrorPlot.css`。被讀：products/batch-error.mdx 以 `client:visible` 掛載。
    - [BatchErrorPlot.css](../src/components/BatchErrorPlot.css) — 上圖的專用樣式，與元件並列（自 utilities.css 移入）。被讀：BatchErrorPlot.tsx。
  - **navigation/**
    - [legacy-bookmarks.ts](../src/navigation/legacy-bookmarks.ts) — 原型時代 `/#route(/section)` 網址的純查詢對照表；帶 section 的分類路由對到 `/examples/<id>/#section`，不帶 section 的 domain/statistics/science 直接對到 `/#collections`，其餘對到新頁面；`#quickstart` 本身已是首頁實際區段（不轉址），僅 `#quickstart/<section>` 對到 `/#<section>`。無框架依賴。被讀：Header.astro 的 script。
  - **data/**
    - [collection-groups.json](../src/data/collection-groups.json) — 分類登記檔：有序的 id/label 對（models→Models、tasks→Tasks、applications→Applications），順序即側欄與首頁目錄的顯示順序；分組僅供顯示，沒有對應頁面。被讀：product-groups.ts 與 ProductDetails.astro（匯入）、check-catalog.mjs（建置前驗證）。
    - [product-groups.ts](../src/data/product-groups.ts) — 匯出 `getProductGroups()`：內容查詢 `docs` 中 `products/` 前綴的產品（正式建置排除草稿），依標題排序後按各產品 `collections` 欄位分進登記檔各組，回傳「分組＋成員產品」給側欄與首頁共用。被讀：Sidebar.astro 與 ProductDirectory.astro。
    - [legacy-articles.ts](../src/data/legacy-articles.ts) — Quickstart 與 domain、statistics、science 三篇方法案例的單一資料來源（簡介、章節、Python 程式、外部來源）。被讀：首頁 index.mdx（內嵌 Quickstart 的程式與來源）、LegacyArticle.astro 與 downloads 端點。
  - **pages/** — 靜態路由，與 Starlight 內容頁並存
    - [quickstart.astro](../src/pages/quickstart.astro) — 舊 `/quickstart/` 的轉址頁：內嵌 script 把 `#s0`、`#s1`、`#s2`、`#sources` 轉到首頁同 id 錨點，其餘（含無 hash）轉到 `/#quickstart`；無 JS 時退回 meta refresh 到 `/#quickstart`。noindex，canonical 指向 `/`。
    - **collections/**
      - [`[id].astro`](../src/pages/collections/%5Bid%5D.astro) — 舊分類網址的轉址頁：`getStaticPaths` 展開 domain、statistics、science 三個舊 ID，以 `<meta http-equiv="refresh">` 立即轉到 `/#collections`（noindex，canonical 指向首頁），舊書籤不失效。
    - **downloads/**
      - [`[id].ipynb.ts`](../src/pages/downloads/%5Bid%5D.ipynb.ts) — 靜態端點：`getStaticPaths` 以 legacy-articles 的 key 展開參數，`GET` 把同一筆紀錄組成 Jupyter notebook JSON，建置成 `/downloads/<id>.ipynb`。讀：src/data/legacy-articles.ts。
  - **styles/** — 全站樣式
    - [utilities.css](../src/styles/utilities.css) — 只剩 Tailwind 主題與工具層的匯入（互動圖樣式已移至 BatchErrorPlot.css）。載入：astro.config.mjs customCss。
    - [tabula.css](../src/styles/tabula.css) — 品牌主題：CSS 變數、淺深色、首頁 Quickstart 摺疊區塊與 Our products 目錄、按鈕與產品事實卡。載入：同上。
  - **content/docs/** — 英文頁面來源，由 Starlight 依檔案位置產生頁面，例如 `products/batch-error.mdx` 對應 `/products/batch-error/`
    - [index.mdx](../src/content/docs/index.mdx) — 首頁 Overview（原生目錄至 H2）：依序為 TFM 介紹、能力、內嵌 Quickstart（`<details id="quickstart">` 摺疊區塊，內含 `s0`／`s1`／`s2`／`sources` 錨點、安裝與 Iris 程式及 Notebook 下載連結；頁內 script 依 hash 展開並捲動）、「Our products」（H2 `#our-products`，附 `#collections` 別名錨點；ProductDirectory）與 Next steps 卡片（連 Reference 兩頁）。匯入：ProductDirectory、legacy-articles（Quickstart 程式與來源）。
    - [products/batch-error.mdx](../src/content/docs/products/batch-error.mdx) — 教學 demo 產品；`source: /demos/batch-error.py`、屬 tasks＋applications 兩組；匯入 BatchErrorPlot；內含 `csv`／`json` 圍欄供 check-demos.py 比對。
    - [products/cooling-context.mdx](../src/content/docs/products/cooling-context.mdx) — 教學 demo 產品；`source: /demos/cooling-context.py`、屬 models 組；同樣含比對用圍欄。
    - **examples/** — 三個頁面各把自己的 ID 傳給 LegacyArticle，從同一份資料取出不同文章：
      - [domain.mdx](../src/content/docs/examples/domain.mdx) — 比較資料來源改變時的訓練方式。
      - [statistics.mdx](../src/content/docs/examples/statistics.mdx) — 分開訓練、校準與評估資料，檢查預測區間。
      - [science.mdx](../src/content/docs/examples/science.mdx) — 保留整個實驗批次，評估模型在新批次的誤差。
    - [reference/model-architecture.mdx](../src/content/docs/reference/model-architecture.mdx)、[reading-list.mdx](../src/content/docs/reference/reading-list.mdx) — 參考頁，sidebar 手動列入；前者讀 `/assets/context.svg`。
    - [404.mdx](../src/content/docs/404.mdx) — 找不到頁面時的 splash 模板，關閉搜尋索引。
  - **content/i18n/**
    - [en.json](../src/content/i18n/en.json) — 覆寫 Starlight 搜尋框標籤（"Search Tabula"）。載入：i18nLoader。
- **public/** — 原樣複製進 `dist/`，只以靜態網址引用
  - **assets/** — [atlas.svg](../public/assets/atlas.svg) 是 favicon 與品牌圖（Header）；[context.svg](../public/assets/context.svg) 是 model-architecture 的輸入輸出示意圖；[domain](../public/assets/domain.svg)、[statistics](../public/assets/statistics.svg)、[science](../public/assets/science.svg) 三張是舊分類卡的插圖，重構後保留為靜態素材，目前沒有元件引用。
  - **demos/** — [batch-error.py](../public/demos/batch-error.py) 與 [cooling-context.py](../public/demos/cooling-context.py)：分別讀取 CSV，計算各批次及整體平均誤差、整理冷卻量預測所用的已標記與待預測資料列。兩者只需 Python 標準庫；產品頁以 `/demos/…` 連結下載，check-catalog 驗證 `source` 路徑存在，建置後由 check-demos.py 實際執行 `dist/demos/` 的副本。

## 走讀一：一個產品頁如何生成

1. 維護者依[範本](templates/product.mdx)寫 [products/batch-error.mdx](../src/content/docs/products/batch-error.mdx)；frontmatter 的自訂欄位由 [content.config.ts](../src/content.config.ts) 的擴充 schema 驗證，`collections: [tasks, applications]` 是歸屬的唯一登記處，有效 ID 來自 [collection-groups.json](../src/data/collection-groups.json)。
2. `npm run build` 先跑 [check-catalog.mjs](../scripts/check-catalog.mjs)：欄位齊全、兩個分組 ID 都在登記檔、`/demos/batch-error.py` 真的在 `public/`、`## Tutorial` 恰一個且有步驟。不通過就不建置。
3. Astro 建 `products/batch-error/` 頁時，Starlight 用 [astro.config.mjs](../astro.config.mjs) 註冊的覆寫把正文交給 [DocContent.astro](../src/components/DocContent.astro)：開頭插入 [ProductDetails](../src/components/ProductDetails.astro)——它對照登記檔把所屬分組寫成純文字標籤，並把 `source` 轉成下載鈕。
4. 建置時，[BatchErrorPlot.tsx](../src/components/BatchErrorPlot.tsx) 先產生滑桿和圖形的 HTML；`client:visible` 讓瀏覽器在圖表進入畫面時接上 React 互動。改外觀則看旁邊的 [BatchErrorPlot.css](../src/components/BatchErrorPlot.css)。
5. 讀者在首頁 Overview「Our products」目錄（`#collections` 別名錨點）的 Tasks 與 Applications 兩組、以及側欄的對應分組都會看到 Batch Error，連到同一個 `/products/batch-error/`，網址的 `?group=tasks` 或 `?group=applications` 讓側欄知道應標示哪個入口。直接開啟沒有分組參數的產品頁時，選用該產品在目錄中的第一組；舊網址 `/collections/statistics/` 由 [collections/[id].astro](../src/pages/collections/%5Bid%5D.astro) 轉到 `/#collections`。
6. CI（[pages.yml](../.github/workflows/pages.yml)）建置後跑 [check-demos.py](../scripts/check-demos.py)：用頁面圍欄裡的輸入執行 `dist/demos/batch-error.py`，輸出 JSON 必須等於頁面上的預期輸出，才部署 `dist/`。

## 走讀二：一份文章資料如何同時產生網頁與 Notebook

1. [legacy-articles.ts](../src/data/legacy-articles.ts) 定義 quickstart 與三篇案例的文字、程式碼與來源；頁面與 Notebook 都只讀這一份。
2. examples/ 三頁匯入 [LegacyArticle.astro](../src/components/LegacyArticle.astro)，傳入 ID 就渲染出整篇文章與自帶目錄；Quickstart 紀錄則由首頁 [index.mdx](../src/content/docs/index.mdx) 直接內嵌（摺疊區塊，章節沿用 `s0`／`s1`／`s2`／`sources` 錨點）。
3. 同一批 key 驅動 [`[id].ipynb.ts`](../src/pages/downloads/%5Bid%5D.ipynb.ts)：`getStaticPaths` 為每篇文章生成 `/downloads/<id>.ipynb`，Quickstart 的下載鈕在首頁 Overview，其餘在文章頁。新增一筆資料後，建置會多產生一個 Notebook；要讓讀者也能從網頁閱讀，還要新增對應的 MDX，將該 ID 傳給 LegacyArticle。
4. 舊原型用 `/#domain/section` 形式的首頁書籤；[Header.astro](../src/components/Header.astro) 的瀏覽器腳本匯入 [legacy-bookmarks.ts](../src/navigation/legacy-bookmarks.ts) 做純查詢對照，把帶 section 的分類書籤轉到 `/examples/<id>/#section`。例如 `/#science/s2` 會開啟 `/examples/science/#s2`；`/#science` 則直接落在首頁 `#collections` 別名錨點；`/#quickstart/s1` 會展開首頁 Quickstart 並落在 `#s1`，`/#quickstart` 本身就是首頁實際區段、不轉址。舊頁面網址 `/quickstart/` 另由 [quickstart.astro](../src/pages/quickstart.astro) 轉到 Overview。

## 生成目錄（不入版控）

`node_modules/` 是 npm 套件；`dist/` 是 `astro build` 的產物，也是 CI 部署到 GitHub Pages 的內容；`.astro/` 是 Astro 產生的型別與快取；`.ruff_cache/` 是本機 Python 工具快取。
