# 研究章程：Tabula

狀態：探索性教學與前端實作。更新日期：2026-11-25。此站介紹研究方向；正式團隊名稱及學術成果的對應關係仍待提供。

## 1. 問題與範圍

**observed**：委託指定 domain-specific tabular foundation models、statistical tasks、scientific tasks 三個方向。交付物是英文 Tutorials 網站。起始工作目錄為空，唯一設計參考為委託附上的介面截圖。

**planned**：面對新的表格資料來源、需要量化預測不確定性或需要外推到新實驗批次時，讀者能否從首頁找到與問題相符的設計，並識別要保留的測試資料？分析單位是一位首次到訪的讀者對一道情境題的作答。這是教學可用性問題；此站沒有提出團隊模型優於其他模型的主張。

## 2. 假設與其他解釋

**planned H1**：三個以任務命名、配有示意圖的入口可改善讀者首次選對教學的比例，相較於只有文章標題的清單。**planned H0**：首次命中比例相同。讀者原有的統計知識及任務措辭也可能解釋差異。尚無讀者測試結果。

## 3. 觀測與分析約定

**planned**：為每個方向撰寫一題，以不照抄標題的文字描述決策情境。記錄首選、對資料切分理由的回答，以及未完成的作答。比較兩種入口的首選正確率差；分開報告三題與讀者經驗。不將點擊當作理解的充分證據。

## 4. 材料與溯源

- **observed**：委託提供的截圖展示多視窗深色介面；採用委託文字指定的淺色文件版面。本站品牌為設計識別，並未聲稱任何機構背書。
- **observed**：`src/data/legacy-articles.ts` 保留帶種子的合成資料、切分邏輯、評估方法及外部來源。其中的 Quickstart 使用 scikit-learn 提供的 Iris 資料。圖為向量示意，不呈現實測結果。
- **unknown**：正式團隊論文、程式庫、資料版本及其授權。在取得可核對的來源前，例題只能以示範教學的形式發佈。

## 5. 最小判別實驗

**planned**：對首次讀者隨機分配本站入口或相同內容的純標題清單，各做一題，題目在組間平衡。先用小規模走查辨認歧義；正式比較前固定樣本數、主要指標、實質效果門檻、遺漏處理及停止條件。若分組差異不明確，記錄不確定性與錯選原因。不得以介面測試推論模型效能。

## 6. 網站開發規格與執行方式

### 6.1 正式網站規格（planned：已確定的開發需求）

**技術棧**：採用 Astro + Starlight 建置文件站，以 MDX 撰寫教學、TypeScript 開發前端邏輯、Tailwind CSS 管理樣式。使用 React 開發互動元件、GSAP 製作動效、D3.js 繪製科學視覺化、KaTeX 排版數學公式，並以 Expressive Code 提供程式碼高亮。

**設計方向**：融合 PyTorch Tutorials 的科研嚴謹性、TensorFlow Tutorials 的資訊架構、Distill.pub 的科學視覺化，以及 Linear、Vercel 的前端工藝。維持清楚的導覽、易讀的技術文件與學術專業性，並在此前提下最大化視覺精緻度、互動體驗與動效表現。網站保留獨立品牌識別。

**執行與部署**：網站採純靜態建置，所有執行期功能均在瀏覽器端完成，無需任何後端服務。透過 GitHub Actions 建置靜態產物並部署至 GitHub Pages。

### 6.2 現行 Astro 示範站（observed）

**預覽與部署**：使用 Node.js 22.23.4 以上版本，從根目錄執行 `npm ci`、`npm run dev`。`npm run build` 檢查產品資料並產生 `dist/`，`npm run preview` 可檢查成品與搜尋。Pages 工作流程只發布 `dist/`，首次切換需在儲存庫 Pages 設定選 GitHub Actions。

**內容維護**：`src/content/docs/index.mdx` 是首頁 Overview：依序介紹 TFM、能力、內嵌 Quickstart（Iris 例，摺疊區塊）、「Our products」目錄與 Next steps 卡片，使用 Starlight 原生目錄，Quickstart 不再是獨立頁面；其餘英文頁面同在 `src/content/docs/`。分組的 id 與英文標籤登記在 `src/data/collection-groups.json`，側欄與首頁目錄由它加上產品 frontmatter 產生。`src/data/legacy-articles.ts` 的 Quickstart 紀錄供首頁內嵌例與 `/downloads/quickstart.ipynb` 共用，三篇方法案例則供參考案例頁與對應 Notebook 使用。`public/assets/` 存放向量示意圖，`public/demos/` 存放可下載的教學腳本。

**範例執行**：下載 Notebook 後在自己的 Python 環境執行。TabPFN 9.0.0 需要相應權重，首次使用請遵照上游的存取與授權程序。資料種子已固定；運算核心、套件與權重雜湊尚未全部固定，數值可能隨環境而異。

## 7. 證據索引

| 項目 | 證據 | 性質 |
| --- | --- | --- |
| 三個研究方向及入口 | 委託、`src/data/collection-groups.json`（models、tasks、applications） | observed：介面範圍；初版以 `src/content/docs/collections/` 定義頁實作，屬歷史紀錄 |
| 跨域、區間、批次教學 | `src/data/legacy-articles.ts` 各章節、程式與 sources | derived：合成案例設計 |
| 模型資訊流 | `public/assets/context.svg` 與 Model architecture | schematic：輸入輸出，非特定 checkpoint 層級架構 |
| 學習成效 | 第 5 節待執行實驗 | planned |

## 8. 未決事項與更新紀錄

首次交付建立教學分類與實作入口。研究團隊後續需提供正式名稱、代表成果、作者歸屬、可引用版本及公開權限，再把具名成果編入對應教學。讀者族群、招募方式、同意程序和決策門檻在讀者試驗開始前決定。

**已確認的架構決策**：正式站採單一文件站，三個研究方向共用版型、元件與建置流程；教學頁與可下載 Notebook 共用範例來源。[內容架構](docs/architecture.md) 記錄內容歸屬與維護方式，[程式碼導讀](docs/code-map.md) 依目錄列出檔案職責與依賴。第 6.2 節記錄現行 Astro 建置與預覽方式。

**產品分類決策**：Collection 是可擴充的一級產品分類；同一產品直接列在所有適用分類，不設主分類。分類僅供顯示：`src/data/collection-groups.json` 以有序 id/label 對登記 `models`、`tasks`、`applications` 三組，沒有分類頁面；首頁 `#collections` 目錄與側欄直接連到產品頁，產品頁上的分組以純文字顯示，舊 `/collections/<id>/` 網址轉址到 `/#collections`。每個收錄產品的使用教學必須寫在產品頁內，跨類共用同一頁；版本與發布資訊維護在同一產品紀錄，詳見[研究產品定位與分類規範](docs/product-protocol.md)。

**側欄定位**：進入產品頁時展開並標示該產品所在的分組。跨組產品由首頁或側欄連結的 `?group=` 保留讀者選擇的入口；沒有有效入口時取目錄中第一個符合的組。這個顯示順序不改變產品歸屬。

**撰稿位置**：分組的 id 與英文標籤登記於 `src/data/collection-groups.json`。從[產品範本](docs/templates/product.mdx) 建立 `src/content/docs/products/<product-id>.mdx`，以該檔的 `collections` 欄位列出全部適用分組，並在同檔完成 `## Tutorial`。教學腳本以 `demo: true` 標示；第三方模型及純方法案例保留原始歸屬。

**重構紀錄（顯示分組）**：初版以三個 collection 定義頁（`src/content/docs/collections/` 的 domain、statistics、science）作為讀者入口；第 1–3、5 節的讀者實驗設計即以該入口為對象，相關敘述為歷史紀錄。現行網站改為純顯示分組（models、tasks、applications），舊分類網址轉址至 `/#collections`；Quickstart、參考案例頁與 Notebook 下載不受此重構影響。

**重構紀錄（首頁 Overview）**：首頁 `/` 改為單一 Overview：依序介紹 TFM、能力、內嵌 Quickstart（Iris 例，摺疊區塊 `#quickstart`，章節沿用 `s0`／`s1`／`s2`／`sources` 錨點）、「Our products」目錄（H2 `#our-products`，並保留 `#collections` 別名錨點）與 Next steps 卡片，啟用 Starlight 原生目錄。側欄頂層依序為 Overview、Collections、Reference，不再設 Getting Started 段。舊 `/quickstart/` 頁由 `src/pages/quickstart.astro` 轉址：帶 `#s0`～`#sources` 的深連結落到首頁同 id 錨點，其餘落到 `/#quickstart`。文章資料與 `/downloads/*.ipynb` Notebook 不變。

## 9. 維護守則

[程式碼導讀](docs/code-map.md)依目錄列出檔案職責與依賴。新增、搬移檔案或變更其讀取方式時，一併更新導讀。舊首頁書籤的網址對照由 `src/navigation/legacy-bookmarks.ts` 維護；互動圖的專用樣式與元件並列。

開發期間將啟動命令、部署方式、檔案分工與維護決策記在 `AGENTS.md`。根目錄的英文 `README.md` 面向開發者，記錄現行網站的預覽、修改、驗證及發布方式。發布流程位於 `.github/workflows/pages.yml`，適用於 `Chi-SquareLab/Chi-SquareLab.github.io`。

更新資料、範例或推論時一併更新來源與決策紀錄。區分教學資料、探索性結果及事先註冊的比較。保留失敗與無差異結果。不得將私人資料或未授權權重納入網站。
