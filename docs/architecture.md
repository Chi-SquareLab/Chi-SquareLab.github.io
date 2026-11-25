# Tabula 內容架構

第一次讀程式碼，先打開[逐檔目錄樹與依賴導讀](code-map.md)。本頁說明編輯產品與分類的規則。

讀者的路徑是 **在首頁 `#collections` 目錄（或側欄）依分組找到產品 → 直接開產品頁 → 在產品頁跟著 Tutorial 完成一次任務**。Collection 只是顯示分組：沒有分類頁面，目錄、側欄與產品頁的分組標籤都直接連到產品頁。維護者只寫一份產品文件；即使產品同時列在 Tasks 與 Applications 兩組，版本、安裝方式和使用教學仍來自同一檔案。

## 內容放在哪裡

```text
src/content/docs/
└── products/             每個產品一檔：產品說明、分組、版本與使用教學

src/data/
└── collection-groups.json  分類登記檔：有序的 id 與 label（models、tasks、applications）

docs/
├── product-protocol.md   判斷什麼成果算產品、該列入哪些分組
├── architecture.md       本文件：檔案歸屬與維護方式
└── templates/product.mdx 新產品的英文撰稿範本
```

**分類登記檔** `src/data/collection-groups.json` 以有序的 id/label 對定義三個分組：`models`、`tasks`、`applications`。分組只供顯示，沒有對應頁面。**產品檔**以穩定識別碼命名，例如 `products/<product-id>.mdx`，其網址為 `/products/<product-id>/`。目前收錄兩個有實際腳本的教學 Demo：Cooling Context（屬 `models` 組）與 Batch Error（屬 `tasks` 與 `applications` 組），均標註 `demo: true`。

歸屬只在產品檔開頭的 `collections` 欄位登記。例如 `collections: [tasks, applications]` 表示兩組都要列出該產品。Astro 建置時依登記檔的順序分組產生側欄與首頁目錄，連結直接指向產品頁；分組沒有自己的頁面，也就無須在別處抄產品名單。全站 Quickstart 介紹共同的入門操作，每項產品的具體用法則寫在自己的 `## Tutorial`。

## 如何新增或更新內容

| 要做的事 | 修改位置與完成條件 |
| --- | --- |
| 收錄產品 | 依[產品規範](product-protocol.md)核對用途、來源與歸屬。複製[英文範本](templates/product.mdx)到 `src/content/docs/products/<product-id>.mdx`，填入維護者、交付形式、版本、存取條件及所有適用分組。 |
| 寫產品教學 | 在同檔 `## Tutorial` 示範一次完整操作：取得或開啟產品、準備輸入、執行任務、解讀輸出。收錄前用所述版本核對這條路徑；Notebook 可作補充。 |
| 更新版本或跨類收錄 | 修改原產品檔，核對教學與新版輸出。變更名稱或分組時保留檔名，既有引用才會繼續指向同一產品。 |
| 新增第四個方向 | 在 `src/data/collection-groups.json` 依顯示順序加入一組 id/label，把收錄判準寫進[產品規範](product-protocol.md)，再把新分組 ID 加入適用產品的 `collections` 欄位。側欄與首頁目錄自動反映，沒有新頁面要寫。 |

## 撰稿、預覽與發布的邊界

`src/components/` 負責側欄、首頁產品目錄、產品摘要、導覽與互動圖；側欄與目錄都由 `src/data/product-groups.ts` 的 `getProductGroups()` 餵資料，產品頁的分組以純文字顯示。Starlight 從 MDX 產生產品頁、頁內目錄與搜尋索引；頁面可直接閱讀，互動圖才載入 React。`public/demos/` 是產品頁連結的 Python 腳本。網站沒有後端，不執行 Python。舊 `/collections/<id>/` 網址由 `src/pages/collections/[id].astro` 轉址到 `/#collections`，既有書籤不會失效。

`src/data/legacy-articles.ts` 保留 Quickstart 與三組合成資料案例。參考文章及 `/downloads/*.ipynb` 共用這些紀錄；首頁舊 `#domain`、`#statistics`、`#science` 書籤會落在首頁 `#collections` 目錄（帶章節的書籤仍轉到 `/examples/<id>/`）。

`npm run build` 先驗證產品規範，再將網站建置到 `dist/`。GitHub Pages 使用 Actions 發布這個目錄；預覽與切換部署來源的步驟見[開發者 README](../README.md)。
