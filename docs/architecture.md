# Tabula 內容架構

讀者的路徑是 **選 Collection → 選 Product → 在產品頁跟著 Tutorial 完成一次任務**。維護者只寫一份產品文件。即使產品同時列在統計與科學兩類，版本、安裝方式和使用教學仍來自同一檔案。

## 內容放在哪裡

```text
src/content/docs/
├── collections/          每類一檔：定義服務的研究任務與收錄範圍
│   ├── domain.mdx        Domain TFMs
│   ├── statistics.mdx    Statistical Tasks
│   └── science.mdx       Scientific Tasks
└── products/             每個產品一檔：產品說明、版本與使用教學

docs/
├── product-protocol.md   判斷什麼成果算產品、該列入哪些分類
├── architecture.md       本文件：檔案歸屬與維護方式
└── templates/product.mdx 新產品的英文撰稿範本
```

**分類檔**定義一類研究需求，檔名就是分類識別碼，例如 `statistics`。**產品檔**以穩定識別碼命名，例如 `products/<product-id>.mdx`，其網址為 `/products/<product-id>/`。目前收錄兩個有實際腳本的教學 Demo：Cooling Context 與 Batch Error，均標註 `demo: true`。

歸屬只在產品檔開頭的 `collections` 欄位登記。例如 `collections: [statistics, science]` 表示兩類都要列出該產品。Astro 建置時依此產生清單，分類檔無須再抄一份產品名稱。全站 Quickstart 介紹共同的入門操作，每項產品的具體用法則寫在自己的 `## Tutorial`。

## 如何新增或更新內容

| 要做的事 | 修改位置與完成條件 |
| --- | --- |
| 收錄產品 | 依[產品規範](product-protocol.md)核對用途、來源與歸屬。複製[英文範本](templates/product.mdx)到 `src/content/docs/products/<product-id>.mdx`，填入維護者、交付形式、版本、存取條件及所有適用分類。 |
| 寫產品教學 | 在同檔 `## Tutorial` 示範一次完整操作：取得或開啟產品、準備輸入、執行任務、解讀輸出。收錄前用所述版本核對這條路徑；Notebook 可作補充。 |
| 更新版本或跨類收錄 | 修改原產品檔，核對教學與新版輸出。變更名稱或分類時保留檔名，既有引用才會繼續指向同一產品。 |
| 新增第四個方向 | 在 `collections/` 新增英文 MDX，說明收錄範圍與邊界例子；把新分類識別碼加入適用產品的 `collections` 欄位。 |

## 撰稿、預覽與發布的邊界

`src/components/` 負責分類清單、產品摘要、導覽與互動圖。Starlight 從 MDX 產生產品頁、頁內目錄與搜尋索引；頁面可直接閱讀，互動圖才載入 React。`public/demos/` 是產品頁連結的 Python 腳本。網站沒有後端，不執行 Python。

`src/data/legacy-articles.ts` 保留 Quickstart 與三組合成資料案例。參考文章及 `/downloads/*.ipynb` 共用這些紀錄；首頁舊 `#domain`、`#statistics`、`#science` 書籤會轉到相應分類。

`npm run build` 先驗證產品規範，再將網站建置到 `dist/`。GitHub Pages 使用 Actions 發布這個目錄；預覽與切換部署來源的步驟見[開發者 README](../README.md)。
