# Tabula 內容架構

第一次讀程式碼，先打開[逐檔目錄樹與依賴導讀](code-map.md)。本頁說明編輯產品與分類的規則。

首頁 `/` 是單一 Overview 內容頁：依序介紹 TFM、列出能力、內嵌可摺疊的 Quickstart（Iris 例，`#quickstart`，章節錨點 `s0`／`s1`／`s2`／`sources`），再以「Our products」目錄（H2 `#our-products`，另設 `#collections` 別名錨點）列出產品，最後是 Next steps 卡片；頁面使用 Starlight 原生目錄。讀者的路徑是 **在首頁 Overview 認識 TFM 與能力（需要時展開 Quickstart）→ 在「Our products」目錄（或側欄）依分組找到產品 → 直接開產品頁 → 在產品頁跟著 Tutorial 完成一次任務**。Collection 只是顯示分組：沒有分類頁面，目錄與側欄的產品名稱直接連到產品頁，產品頁內以文字列出所屬分組。維護者只寫一份產品文件；即使產品同時列在 Tasks 與 Applications 兩組，版本、安裝方式和使用教學仍來自同一檔案。

## 內容放在哪裡

```text
src/content/docs/
├── index.mdx             首頁 Overview：TFM 介紹、能力、內嵌 Quickstart、Our products 目錄與 Next steps
└── products/             每個產品一檔：產品說明、分組、版本與使用教學

src/data/
└── collection-groups.json  分類登記檔：有序的 id 與 label（models、tasks、applications）

docs/
├── product-protocol.md   判斷什麼成果算產品、該列入哪些分組
├── architecture.md       本文件：檔案歸屬與維護方式
└── templates/product.mdx 新產品的英文撰稿範本
```

**分類登記檔** `src/data/collection-groups.json` 以有序的 id/label 對定義三個分組：`models`、`tasks`、`applications`。分組只供顯示，沒有對應頁面。**產品檔**以穩定識別碼命名，例如 `products/<product-id>.mdx`，其網址為 `/products/<product-id>/`。目前收錄兩個有實際腳本的教學 Demo：Cooling Context（屬 `models` 組）與 Batch Error（屬 `tasks` 與 `applications` 組），均標註 `demo: true`。

歸屬只在產品檔開頭的 `collections` 欄位登記。例如 `collections: [tasks, applications]` 表示兩組都要列出該產品。Astro 建置時依登記檔的順序分組產生側欄與首頁目錄，連結直接指向產品頁；分組沒有自己的頁面，也就無須在別處抄產品名單。首頁 Overview 內嵌的 Quickstart（Iris 例）介紹共同的入門操作，每項產品的具體用法則寫在自己的 `## Tutorial`。

## 如何新增或更新內容

| 要做的事 | 修改位置與完成條件 |
| --- | --- |
| 收錄產品 | 依[產品規範](product-protocol.md)核對用途、來源與歸屬。複製[英文範本](templates/product.mdx)到 `src/content/docs/products/<product-id>.mdx`，填入維護者、交付形式、版本、存取條件及所有適用分組。 |
| 寫產品教學 | 在同檔 `## Tutorial` 示範一次完整操作：取得或開啟產品、準備輸入、執行任務、解讀輸出。收錄前用所述版本核對這條路徑；Notebook 可作補充。 |
| 更新版本或跨類收錄 | 修改原產品檔，核對教學與新版輸出。變更名稱或分組時保留檔名，既有引用才會繼續指向同一產品。 |
| 新增第四個方向 | 在 `src/data/collection-groups.json` 依顯示順序加入一組 id/label，把收錄判準寫進[產品規範](product-protocol.md)，再把新分組 ID 加入適用產品的 `collections` 欄位。側欄與首頁「Our products」目錄自動反映，沒有新頁面要寫。 |

## 撰稿、預覽與發布的邊界

`src/components/` 負責側欄、首頁產品目錄、產品摘要、導覽與互動圖；側欄與目錄都由 `src/data/product-groups.ts` 的 `getProductGroups()` 餵資料（含產品連結與描述），產品頁的分組以純文字顯示。Starlight 從 MDX 產生頁面、原生頁內目錄與搜尋索引；頁面可直接閱讀，互動圖才載入 React。`public/demos/` 是產品頁連結的 Python 腳本。網站沒有後端，不執行 Python。舊網址都保留落點：`/collections/<id>/` 由 `src/pages/collections/[id].astro` 轉到 `/#collections`；`/quickstart/` 由 `src/pages/quickstart.astro` 轉到 Overview 的 Quickstart 區塊，帶 `#s0`、`#s1`、`#s2`、`#sources` 的深連結落到首頁同 id 錨點，其餘落到 `/#quickstart`。

`src/data/legacy-articles.ts` 保留 Quickstart 與三組合成資料案例，是首頁內嵌 Quickstart、參考案例頁及 `/downloads/*.ipynb` 的共同來源；首頁舊 `#domain`、`#statistics`、`#science` 書籤會落在「Our products」目錄（帶章節的書籤仍轉到 `/examples/<id>/`）。

`npm run build` 先驗證產品規範，再將網站建置到 `dist/`。GitHub Pages 使用 Actions 發布這個目錄；預覽與切換部署來源的步驟見[開發者 README](../README.md)。
