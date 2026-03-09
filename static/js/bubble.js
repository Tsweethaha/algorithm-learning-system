// 冒泡排序页面专用逻辑
const DEFAULT_BARS = [5, 2, 4, 1];

function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

function renderBars(values = DEFAULT_BARS){
  const box = document.getElementById("bubble-container");
  if(!box) return;
  box.innerHTML = values.map(v => `<div class="bar" data-value="${v}">${v}</div>`).join("");
}

async function runBubbleAnimation(){
  const box = document.getElementById("bubble-container");
  if(!box) return;
  let bars = Array.from(box.children);
  for(let i=0;i<bars.length-1;i++){
    const a = bars[i], b = bars[i+1];
    a.style.transform = "translateY(-6px)"; b.style.transform = "translateY(-6px)";
    a.style.background = "#f39c12"; b.style.background = "#f39c12";
    logEvent("compare_"+i);
    await sleep(600);
    if(Number(a.dataset.value) > Number(b.dataset.value)){
      box.insertBefore(b, a);
      logEvent("swap_"+i);
      bars = Array.from(box.children);
    }
    a.style.transform = ""; b.style.transform = "";
    a.style.background = ""; b.style.background = "";
    await sleep(300);
  }
  logEvent("animation_done");
}

function resetBars(){
  renderBars(DEFAULT_BARS);
}

function checkAnswer(ans){
  const out = document.getElementById("quiz-result");
  if(!out) return;
  if(ans === "5"){
    out.innerText = "✔ 正确！5 会移到最右侧。+20 分";
    out.style.color = "#2ecc71";
    addScore(20); unlockBadge("starter"); markCompleted("bubble");
  } else {
    out.innerText = "✖ 错误，再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn){
  const out = document.getElementById("ai-output");
  if(out) out.innerText = "AI 正在生成提示...";
  if(btn) btn.disabled = true;
  addScore(-5); logEvent("ai_hint");
  const ans = await aiCall("/hint", "冒泡排序第一轮：[5,2,4,1]，请给个提示");
  if(out) out.innerText = ans;
  if(btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn){
  const out = document.getElementById("ai-output");
  if(out) out.innerText = "AI 正在生成解释...";
  if(btn) btn.disabled = true;
  addScore(-10); logEvent("ai_explain");
  const ans = await aiCall("/explain", "请解释冒泡排序第一轮：[5,2,4,1] 的过程");
  if(out) out.innerText = ans;
  if(btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initBubble(){
  initCommonUI();
  resetBars();

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if(playBtn) playBtn.addEventListener("click", () => { runBubbleAnimation(); logEvent("play_animation"); });
  if(resetBtn) resetBtn.addEventListener("click", () => { resetBars(); logEvent("reset_animation"); });
  if(completeBtn) completeBtn.addEventListener("click", () => { markCompleted("bubble"); unlockBadge("starter"); addScore(10); });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if(aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if(aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initBubble);



