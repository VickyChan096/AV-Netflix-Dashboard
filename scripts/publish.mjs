// 一鍵發佈：建置檢查 → git add → commit → push
// 用法：
//   npm run publish              （commit 訊息自動帶日期）
//   npm run publish -- "新增沙丘2"（自訂 commit 訊息）
import { execSync } from "node:child_process";

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", ...opts });
}

// 1) 先確認有沒有變更，沒變更就直接結束
const changes = execSync("git status --porcelain", { encoding: "utf8" }).trim();
if (!changes) {
  console.log("\n沒有任何變更，不需要發佈。");
  process.exit(0);
}

// 2) 建置檢查（格式或程式錯誤會在這裡擋下，不會 push 壞資料）
console.log("\n[1/4] 建置檢查中…");
run("npm run build");

// 3) 加入所有變更
console.log("\n[2/4] 加入變更…");
run("git add -A");

// 4) commit（訊息取自參數，沒給就用日期）
const now = new Date();
const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
  now.getDate(),
).padStart(2, "0")}`;
const rawMsg = process.argv.slice(2).join(" ").trim();
const msg = (rawMsg || `更新 ${date}`).replace(/"/g, "'"); // 避免雙引號打斷指令
console.log(`\n[3/4] 建立 commit：「${msg}」`);
run(`git commit -m "${msg}"`);

// 5) 推送
console.log("\n[4/4] 推送到 GitHub…");
run("git push");

console.log("\n✅ 完成！到 GitHub 的 Actions 分頁看綠勾，約 1～2 分鐘後網站就會更新。");
