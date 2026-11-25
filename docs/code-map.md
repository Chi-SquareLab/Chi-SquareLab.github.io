# 我要改網站的哪個檔案？

**改首頁歡迎頁，打開 [index.astro](../src/pages/index.astro)；改文件 Overview，打開 [overview.mdx](../src/content/docs/overview.mdx)；改產品，打開 [products/](../src/content/docs/products/)；新增一般文章，放進 [reference/](../src/content/docs/reference/)。** `.mdx` 是這個網站用來寫頁面的文字檔。檔案開頭兩行 `---` 之間是頁面資料，例如標題 `title`；第二行 `---` 之後是讀者看到的正文。網站內容用英文撰寫。

## 修改現有內容

| 我想改什麼？ | 開哪個檔案？ | 改哪裡？ |
| --- | --- | --- |
| 歡迎頁的標語、首屏文案或 GitHub 連結 | [index.astro](../src/pages/index.astro) | 找畫面上的原句，例如 `Learning from tables.` 或「Enter the tutorials」按鈕；版面樣式在 [welcome.css](../src/styles/welcome.css)，捲動與視差動效在 [welcome-motion.ts](../src/scripts/welcome-motion.ts)。 |
| 歡迎頁使命聲明與三個研究理念區塊 | [mission.json](../src/data/mission.json) | 依 JSON 欄位編輯 `sectionTitle`、`statement`（`lead` 與 `emphasis`）、`paragraphs` 與 `pillars`（編號由陣列順序自動產生）；建置時驗證欄位，版面與背景 χ² 曲線動畫在 [MissionSection.astro](../src/components/welcome/MissionSection.astro)。 |
| 歡迎頁的輸入表格、預測示意圖與循環動畫 | [ForwardDiagram.astro](../src/components/welcome/ForwardDiagram.astro) | SVG 和 9.6 秒循環的關鍵影格在同一檔。調整圖與標題在桌面、手機上的相對位置，改 [ForwardFigure.astro](../src/components/welcome/ForwardFigure.astro)。 |
| 研究動態的新聞內容 | [research-news.json](../src/data/research-news.json) | 在陣列加一筆記錄，格式與排序約定見下方「新增一則研究動態」。 |
| Overview 的介紹、TFM 說明、Iris 摺疊區塊的文字或底部連結 | [overview.mdx](../src/content/docs/overview.mdx) | 找畫面上的原句或標題，例如 `What can a TFM do?` 或 `Next steps`。 |
| SurvTFM 或 Batch Error 的名稱、簡介、分組、使用教學 | [survtfm.mdx](../src/content/docs/products/survtfm.mdx) 或 [batch-error.mdx](../src/content/docs/products/batch-error.mdx) | `title` 是產品名，`description` 是 Overview 目錄也會顯示的簡介，`collections` 決定列在哪些組，`models` 產品另含 `model:` 身份卡欄位。操作步驟寫在 `## Tutorial`。 |
| 閱讀清單的連結，或模型架構的說明 | [reading-list.mdx](../src/content/docs/reference/reading-list.mdx) 或 [model-architecture.mdx](../src/content/docs/reference/model-architecture.mdx) | 直接修改正文。 |
| Iris 預測程式碼，或三篇方法案例的步驟、程式碼、來源 | [notebook-articles.ts](../src/data/notebook-articles.ts) | Iris 的預測程式找 `quickstartCode`；跨域案例找 `domain`，預測區間找 `statistics`，新批次評估找 `science`。頁面與下載的 Notebook 共用這些資料。 |

例如，你在 Overview 的 **Our products** 看到 Batch Error 的簡介需要更新：打開 [batch-error.mdx](../src/content/docs/products/batch-error.mdx)，改 `description` 即可。Overview 頁會讀取這個欄位。

## 修改畫面上的品牌、頂部導覽與左側選單

**同樣是 `Overview`，有兩個來源：** 頂部橫列改 [Header.astro](../src/components/Header.astro) 的 `links`；左側選單第一項與正文上方的大標題都來自 [overview.mdx](../src/content/docs/overview.mdx) 的 `title`（側欄第一項在 [astro.config.mjs](../astro.config.mjs) 寫成 `{ slug: 'overview' }`，不另寫 label）。歡迎頁不套這套 Starlight 版型，品牌與導覽另有專檔，見表內前兩列的說明。

| 畫面上的位置 | 要怎麼改？ |
| --- | --- |
| 左上角品牌圖案與 `Tabula` | 圖案是 [atlas.svg](../public/assets/atlas.svg)，瀏覽器分頁也使用它。品牌文字在 [Header.astro](../src/components/Header.astro) 的 `class="brand"` 連結內。整站更名時，也改 [astro.config.mjs](../astro.config.mjs) 的 `title: 'Tabula'`；換圖檔路徑時，分別更新頁首的 `img src` 與設定裡的 `favicon`。全站配色變數集中在 [palette.css](../src/styles/palette.css)。歡迎頁另有自己的品牌：`Chi-SquareLab` 字樣、[chi-squarelab.svg](../public/assets/chi-squarelab.svg) 標記與頁面 `<title>` 都在 [index.astro](../src/pages/index.astro)。 |
| 頂部橫列的名稱、順序與點擊位置 | 在 [Header.astro](../src/components/Header.astro) 找 `const links`。每列第一項是文字，第二項是網址；移動整列就能調整順序。`Overview` 與 `Collections` 兩列分別指向 `/overview/` 與 `/overview/#our-products`（路徑常數 `overviewPath` 來自 [legacy-bookmarks.ts](../src/navigation/legacy-bookmarks.ts)）。改名稱時也要更新同檔產生區段名稱的 `currentSection()` 與 `isOverview` 判斷，讓底線仍會標出所在區段。若更換目錄落點，同步更新 `syncOverviewNavigation()` 與下方點擊處理裡的錨點。歡迎頁頂部另有自己的導覽（Research news、Mission、GitHub、Tutorials），直接改 [index.astro](../src/pages/index.astro)。 |
| 左側 `Overview`、`Collections`、`Reference` 三列 | 在 [astro.config.mjs](../astro.config.mjs) 找 `sidebar: [`。第一項是 `{ slug: 'overview' }`，顯示名稱取自 [overview.mdx](../src/content/docs/overview.mdx) 的 `title`；`Collections` 與 `Reference` 改 `label` 可換顯示名稱，移動整項可換順序。**若改左側 `Collections` 的名字**，還要同步改 [Sidebar.astro](../src/components/Sidebar.astro) 的 `entry.label === 'Collections'`：這個判斷決定哪一列要放入產品分組。 |
| `Collections` 下的 `Models`、`Tasks`、`Applications` | 改 [collection-groups.json](../src/data/collection-groups.json) 的 `label`；移動整筆就能換順序。Overview 產品目錄和側欄都會跟著更新。只想改顯示文字時，保留 `id`，因為產品用它指定所屬分組。要移動某項產品，改該[產品檔](../src/content/docs/products/)的 `collections`。 |
| `Reference` 下的 `Model architecture`、`Reading list` | 選單預設讀取 [model-architecture.mdx](../src/content/docs/reference/model-architecture.mdx) 和 [reading-list.mdx](../src/content/docs/reference/reading-list.mdx) 的 `title`。只想改選單文字，可在 [astro.config.mjs](../astro.config.mjs) 的 `Reference.items` 裡寫 `{ slug: 'reference/reading-list', label: 'Resources' }`。要換順序就交換 `items` 裡的兩項。Overview 底部同名卡片的文字另外寫在 [overview.mdx](../src/content/docs/overview.mdx)。 |
| 書本圖示、展開箭頭、縮排與選中顏色 | 在 [Sidebar.astro](../src/components/Sidebar.astro) 找 `open-book`（書本）或 `right-caret`（箭頭），`size` 控制大小。檔尾的 `<style>` 控制外觀：`.sidebar-branch` 管縮排與直線，`.caret` 管箭頭方向，`[aria-current]` 相關規則管選中樣式。 |
| 想讓 `Reference` 一開始收起來 | 在 [astro.config.mjs](../astro.config.mjs) 的 `label: 'Reference'` 旁加入 `collapsed: true`。預覽時先從 Overview（`/overview/`）看預設狀態；進入組內文章後，側欄會展開所在組。 |

例如，想把 **Models** 改成 **Model tools**：打開 [collection-groups.json](../src/data/collection-groups.json)，把 `"label": "Models"` 改為 `"label": "Model tools"`，保留 `"id": "models"`。執行 `npm run dev`，看 Overview 的 **Our products**，再展開左側 **Collections**；兩處都應顯示新名稱，原有產品仍在同一組。

## 新增一篇普通文章

假設要新增一頁「資料切分」，網址是 `/reference/data-splitting/`：

1. 在 [src/content/docs/reference/](../src/content/docs/reference/) 建立 `data-splitting.mdx`，寫入：

   ```mdx
   ---
   title: Data splitting
   description: How to separate training and test data.
   ---

   Keep test rows separate before fitting the model.

   ## Example

   To evaluate predictions for a new batch, hold out an entire batch.
   ```

2. 在專案根目錄執行 `npm run dev`。打開終端機顯示的預覽網址，再前往 `/reference/data-splitting/`。
3. 選擇讀者從哪裡進入這頁。要列在左側 **Reference** 選單，就打開 [astro.config.mjs](../astro.config.mjs)，找到 `label: 'Reference'`，在它的 `items` 清單加上 `{ slug: 'reference/data-splitting' }`。如果只想從閱讀清單進入，在 [reading-list.mdx](../src/content/docs/reference/reading-list.mdx) 加上 `[Data splitting](/reference/data-splitting/)` 即可。

## 新增一個產品

1. 複製 [產品範本](templates/product.mdx) 到 [src/content/docs/products/](../src/content/docs/products/)，例如命名為 `batch-summary.mdx`。對應網址是 `/products/batch-summary/`。
2. 填好名稱、簡介、維護者、來源、版本等共通欄位（`delivery` 與 `access` 為選填）。`collections` 填所有適用的分組，例如 `collections: [models]`；凡包含 `models` 時，須一併填寫 `model:` 區塊（`domain`、`tasks`、`baseModel` 必填，`weights`、`paper` 選填）。分組判準與欄位協議見[產品規範](product-protocol.md)。
3. 在同一檔的 `## Tutorial` 寫明：如何取得產品、準備什麼輸入、如何操作、怎麼讀結果。可參照現有的 [Batch Error](../src/content/docs/products/batch-error.mdx)。
4. 執行 `npm run build` 檢查產品資料與網站建置。預覽時，從 Overview 和左側選單各點一次新產品。兩處都會依 `collections` 自動列出產品，不用另加選單項目。

## 新增一則研究動態

若要調整實作：欄位驗證與排序在 [welcome-content.ts](../src/data/welcome-content.ts)，頭條與清單在 [ResearchNews.astro](../src/components/welcome/ResearchNews.astro)，封面與預設插圖在 [NewsCover.astro](../src/components/welcome/NewsCover.astro)。

歡迎頁的 **Our research news** 讀 [research-news.json](../src/data/research-news.json)。記錄依日期新到舊排序，最新一筆成為頭條，其餘列入下方清單（若陣列為空，畫面顯示預留的預覽）。

1. 若該則頭條要配專屬封面圖，先把圖片放進 `public/assets/news/`（例如 `public/assets/news/my-paper.png`，支援 PNG、JPG、WebP、SVG）。
2. 打開 [research-news.json](../src/data/research-news.json)，在陣列加一筆（`cover` 為選填）：

   ```json
   [
     {
       "date": "2026-11-25",
       "kind": "Paper",
       "title": "Paper or project title",
       "summary": "One or two sentences about the update.",
       "url": "https://example.com/paper",
       "cover": {
         "src": "/assets/news/my-paper.png",
         "alt": "Brief description of the figure",
         "caption": "Fig. 1 · Method overview",
         "fit": "contain"
       }
     }
   ]
   ```

3. 欄位約定：`date` 用 `YYYY-MM-DD`；`kind` 是短標籤，例如 `Paper`、`Code`、`Tutorial`；`title` 與 `summary` 用英文；`url` 連到這則成果的論文、儲存庫或教學頁（外部 `https://` 或站內 `/` 開頭路徑）。`cover` 選填：`src` 可填站內 `/assets/...` 路徑或外部 `https://` 網址，`alt` 為圖片替代文字，`caption`（選填）顯示於封面下方，`fit`（選填，預設 `"cover"` 填滿，論文架構圖或白底圖表可改 `"contain"` 完整顯示不裁切）；省略 `cover` 時會顯示預設幾何示意圖。依研究章程，加入前先核對成果歸屬與公開權限。
4. 記錄按日期新到舊排序，最新一筆顯示為主打。欄位缺漏、格式錯誤或站內 `cover.src` 找不到檔案都會在建置時報錯；先跑 `npm run build` 驗證，預覽時開 `/` 檢查畫面。

## 修改已有 Notebook 的案例

以「新批次評估」為例：改**網頁標題或簡介**，開 [batch-generalization.mdx](../src/content/docs/reference/batch-generalization.mdx)；改**實驗步驟、Python 程式碼或 Notebook 開頭的標題**，開 [notebook-articles.ts](../src/data/notebook-articles.ts)，找 `science`。若要同時更名網頁和 Notebook，兩處的 `title` 都要改。

這篇案例的公開網址仍是 `/examples/science/`，由 `.mdx` 開頭的 `slug: examples/science` 指定。只改內容時保留 `slug`，舊書籤就能繼續使用。建置後可從案例頁下載 Notebook 核對修改；下次建置會從原始檔重新產生下載檔。
