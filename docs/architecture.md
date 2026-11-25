# Tabula 內容架構

要修改頁面或新增文章，先打開[網站編輯指南](code-map.md)。本頁說明各類內容由誰讀取，以及頁面與下載檔如何共用來源。

網站有兩個入口：`/` 是團隊歡迎頁，介紹 Chi-SquareLab、研究動態與使命；「Enter the tutorials」連到 `/overview/`。Overview 是 Starlight 文件首頁，包含 TFM 介紹、可展開的 Iris Quickstart、產品目錄與 Next steps。

讀者從目錄或側欄的分組進入產品頁。每個產品只有一份 MDX；即使同時列在 Tasks 和 Applications，兩個入口都連到同一份版本資訊、安裝方式與教學。

## 內容放在哪裡

```text
src/content/docs/
├── overview.mdx            文件 Overview（/overview/）：TFM 介紹、能力、內嵌 Quickstart、Our products 目錄與 Next steps
├── reference/              參考頁與工作範例頁：後者以 slug 保留 /examples/<id>/ 網址
└── products/               每個產品一檔：產品說明、分組、版本與使用教學

src/pages/
├── index.astro             首頁歡迎頁（/）：主視覺、概念動畫、研究動態與使命
├── downloads/[id].ipynb.ts 由共用範例產生 Notebook 下載
├── quickstart.astro        舊 /quickstart/ 轉址到 /overview/#quickstart
└── collections/[id].astro  舊 /collections/<id>/ 轉址到 /overview/#collections

src/components/welcome/     首屏版面與動畫圖、研究動態與封面、使命區塊
src/scripts/welcome-motion.ts 歡迎頁動效控制：GSAP 進場、ScrollTrigger 區塊揭露、χ² 曲線繪製與指標視差（減少動態偏好下自動停用）

src/data/
├── collection-groups.json  分類登記檔：有序的 id 與 label（models、tasks、applications）
├── mission.json            歡迎頁使命與開放社群內容：{sectionTitle, statement, paragraphs, pillars}
├── research-news.json      研究動態與各則選填封面
└── welcome-content.ts      首頁 JSON 的建置時驗證、新聞排序與型別

docs/
├── product-protocol.md   判斷什麼成果算產品、該列入哪些分組
├── code-map.md           按編輯任務查找原始檔
├── architecture.md       本文件：檔案歸屬與維護方式
└── templates/product.mdx 新產品的英文撰稿範本
```

**首頁歡迎頁**的文案放在 `mission.json` 和 `research-news.json`。`welcome-content.ts` 驗證兩份資料、檢查站內封面檔案並按日期排列新聞。`ResearchNews` 決定頭條與清單，`NewsCover` 決定頭條使用專屬封面或預設插圖。`ForwardFigure` 控制首屏版面，`ForwardDiagram` 負責 SVG 與循環動畫；兩者的樣式隨元件維護。

**分類登記檔** `src/data/collection-groups.json` 以有序的 id/label 對定義三個分組：`models`、`tasks`、`applications`。分組只供顯示，沒有對應頁面。**產品檔**以穩定識別碼命名，例如 `products/<product-id>.mdx`，其網址為 `/products/<product-id>/`。目前收錄正式模型 **SurvTFM**（`v0.6.3`，屬 `models` 組，依 `models` 專屬元信息協議填寫 `model:` 區塊）與教學示範 **Batch Error**（屬 `tasks` 與 `applications` 組，標註 `demo: true`）。

歸屬只在產品檔開頭的 `collections` 欄位登記。例如 `collections: [tasks, applications]` 表示兩組都要列出該產品。Astro 建置時依登記檔的順序分組產生側欄與 Overview 目錄，連結直接指向產品頁；分組沒有自己的頁面，也就無須在別處抄產品名單。Overview 內嵌的 Quickstart（Iris 例）介紹共同的入門操作，每項產品的具體用法則寫在自己的 `## Tutorial`。

## 如何新增或更新內容

| 要做的事 | 修改位置與完成條件 |
| --- | --- |
| 收錄產品 | 依[產品規範](product-protocol.md)核對用途、來源與歸屬。複製[英文範本](templates/product.mdx)到 `src/content/docs/products/<product-id>.mdx`，填入維護者、交付形式、版本、存取條件及所有適用分組。 |
| 寫產品教學 | 在同檔 `## Tutorial` 示範一次完整操作：取得或開啟產品、準備輸入、執行任務、解讀輸出。收錄前用所述版本核對這條路徑；Notebook 可作補充。 |
| 更新版本或跨類收錄 | 修改原產品檔，核對教學與新版輸出。變更名稱或分組時保留檔名，既有引用才會繼續指向同一產品。 |
| 發布研究動態 | 將已核對來源的更新寫入 `src/data/research-news.json`；[編輯指南](code-map.md#新增一則研究動態)列有完整封面範例。 |
| 新增第四個方向 | 在 `src/data/collection-groups.json` 依顯示順序加入一組 id/label，把收錄判準寫進[產品規範](product-protocol.md)，再把新分組 ID 加入適用產品的 `collections` 欄位。側欄與 Overview「Our products」目錄自動反映，沒有新頁面要寫。 |

## 撰稿、預覽與發布的邊界

`src/components/` 負責側欄、Overview 產品目錄、產品摘要、導覽、工作範例文章（`WorkedExample`）與互動圖，歡迎頁的動畫與新聞元件在 `src/components/welcome/`；側欄與目錄都由 `src/data/product-groups.ts` 的 `getProductGroups()` 餵資料（含產品連結與描述），產品頁的分組以純文字顯示。Starlight 從 MDX 產生頁面、原生頁內目錄與搜尋索引；頁面可直接閱讀，互動圖才載入 React。`public/demos/` 是產品頁連結的 Python 腳本。網站沒有後端，不執行 Python。舊網址都保留落點：`/collections/<id>/` 由 `src/pages/collections/[id].astro` 轉到 `/overview/#collections`；`/quickstart/` 由 `src/pages/quickstart.astro` 轉到 `/overview/#quickstart`，帶 `#s0`、`#s1`、`#s2`、`#sources` 的深連結落到 `/overview/` 同 id 錨點；舊首頁 `/` 的書籤（`#quickstart`、`#our-products`、`#collections`、TFM 與 Next steps 等錨點，以及除役的 domain、statistics、science 與 `#overview` 系列）由歡迎頁腳本經 `src/navigation/legacy-bookmarks.ts` 的 `welcomeBookmarkTarget` 轉到 `/overview/` 對應錨點（歡迎頁自己的 `#news`、`#mission` 等錨點不受影響）。三篇工作範例頁的原始檔移入 `reference/` 後，以 frontmatter `slug` 保留原 `/examples/<id>/` 網址，不需轉址。

`src/data/notebook-articles.ts` 保留 Quickstart 與三組合成資料案例，是 Overview 內嵌 Quickstart、三個工作範例頁（原始檔在 `src/content/docs/reference/`，以 `slug` 保留 `/examples/<id>/` 網址）及 `/downloads/*.ipynb` 的共同來源；舊 `/#domain`、`/#statistics`、`/#science` 書籤由歡迎頁轉到「Our products」目錄（帶章節的書籤仍轉到 `/examples/<id>/` 的對應錨點）。

`npm run build` 先驗證產品規範，再將網站建置到 `dist/`。GitHub Pages 使用 Actions 發布這個目錄；預覽與切換部署來源的步驟見[開發者 README](../README.md)。
