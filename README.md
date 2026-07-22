# OURFLIX — Vicky & Allen 的觀影紀錄

Netflix 風格的觀影紀錄網站。內容全部來自一個資料檔，改資料 → push → 自動部署到 GitHub Pages。

## 更新片單（日常）

編輯 **`src/data/watchlist.json`**，加一筆看過的片，然後 push 到 GitHub。
幾分鐘後網站就會自動更新。詳細格式與範例見 **[如何更新片單.md](./如何更新片單.md)**。

## 技術

- Vite + React 19 + TypeScript（純靜態 SPA）
- Tailwind CSS v4 + shadcn/ui
- 資料以 `zod` 驗證後渲染；格式打錯時部署會失敗，不會把壞資料上線

## 本機開發（選用）

需要 Node.js 或 Bun。

```sh
npm install
npm run dev      # 開發伺服器
npm run build    # 產生 dist/ 靜態檔
npm run preview  # 預覽建置結果
```

## 部署到 GitHub Pages

第一次設定（只需做一次）：

1. 把專案推到 GitHub（分支用 `main`）。
2. 到 repo 的 **Settings → Pages**，把 **Source** 設成 **GitHub Actions**。
3. 之後每次 push 到 `main`，`.github/workflows/deploy.yml` 會自動建置並部署。

部署進度可在 repo 的 **Actions** 分頁查看；成功後網址會出現在該次 workflow 的 `deploy` 步驟。
