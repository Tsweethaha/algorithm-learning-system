// common.js：放在 static/js/common.js
// 公用方法：score/progress/badge/log/export + AI 请求封装

// 在 common.js 中（放在文件顶部或 init 之前）：
const INJECTED_ALGOS = (typeof window !== "undefined" && Array.isArray(window.ALGOS_LIST)) ? window.ALGOS_LIST : [];
const ALGO_IDS = INJECTED_ALGOS.map(a => a.id);
// 确保本地存储的算法列表与后端注入一致
if(ALGO_IDS.length && JSON.stringify(JSON.parse(localStorage.getItem("algos_list") || "[]")) !== JSON.stringify(ALGO_IDS)){
  localStorage.setItem("algos_list", JSON.stringify(ALGO_IDS));
} else if(!localStorage.getItem("algos_list") && ALGO_IDS.length){
  localStorage.setItem("algos_list", JSON.stringify(ALGO_IDS));
}

// ========== Score & Progress ==========
function getScore(){
  return parseInt(localStorage.getItem("score") || "0");
}
function setScore(v){ localStorage.setItem("score", String(v)); updateScoreUI(); }
function addScore(delta){ setScore(getScore() + delta); logEvent("score_change_"+delta); }

function updateScoreUI(){
  let el = document.getElementById("score-display");
  if(el) el.innerText = getScore();
}

// mark completed algorithm
function markCompleted(algo){
  localStorage.setItem("completed_"+algo, "true");
  logEvent("completed_"+algo);
  updateProgressUI();
}

// progress UI
function updateProgressUI(){
  const algos = JSON.parse(localStorage.getItem("algos_list") || "[]");
  const done = algos.filter(a => localStorage.getItem("completed_"+a) === "true").length;
  const percent = algos.length ? Math.round((done / algos.length) * 100) : 0;
  const inner = document.querySelector(".progress-inner");
  if(inner) inner.style.width = percent + "%";
  const pct = document.getElementById("progress-percent");
  if(pct) pct.innerText = percent + "%";
}

// badges
function unlockBadge(name){
  localStorage.setItem("badge_"+name, "true");
  logEvent("unlock_badge_"+name);
  updateBadgesUI();
}
function hasBadge(name){ return localStorage.getItem("badge_"+name) === "true"; }

function updateBadgesUI(){
  const container = document.getElementById("badges-list");
  if(!container) return;
  container.innerHTML = "";
  const badges = ["starter","quick_sorter","persistent"];
  badges.forEach(b => {
    const unlocked = hasBadge(b);
    const div = document.createElement("div");
    div.className = "badge";
    div.innerText = (unlocked ? "🏅 " : "✦ ") + b;
    container.appendChild(div);
  });
}

// logs
function logEvent(type, detail){
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.push({type, detail:detail || "", time: new Date().toISOString()});
  localStorage.setItem("logs", JSON.stringify(logs));
}

// export logs to CSV
function exportLogs(){
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  if(logs.length === 0){ alert("没有日志可导出"); return; }
  let csv = "type,detail,time\n" + logs.map(l => `${l.type},"${(l.detail||"").replace(/"/g,'""')}",${l.time}`).join("\n");
  downloadCSV(csv, "logs.csv");
}

function downloadCSV(content, filename){
  const blob = new Blob([content], {type: "text/csv;charset=utf-8;"});
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url; link.setAttribute("download", filename);
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

// ========== AI wrapper ==========
async function aiCall(route, question){
  try {
    const res = await fetch(route, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({question})
    });
    const j = await res.json();
    return j.answer || j.hint || j.explain || JSON.stringify(j);
  } catch (e) {
    return "AI 请求失败：" + e.toString();
  }
}

// helper: initialize UI on page load
function initCommonUI(){
  updateScoreUI();
  updateProgressUI();
  updateBadgesUI();
}
document.addEventListener("DOMContentLoaded", initCommonUI);

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");

    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expand");
}
