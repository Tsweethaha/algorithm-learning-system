// 通用占位逻辑：在未完成具体动画前提供基本交互
function initAlgoPage(config){
  if(!config || !config.id) return;
  const {id, title} = config;
  initCommonUI();

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const quizBtn = document.getElementById("placeholder-quiz");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");
  const aiOutput = document.getElementById("ai-output");

  if(playBtn) playBtn.addEventListener("click", () => {
    logEvent("start_"+id);
    if(aiOutput) aiOutput.innerText = "动画占位：稍后会加入真实可视化。";
  });

  if(resetBtn) resetBtn.addEventListener("click", () => {
    logEvent("reset_"+id);
    if(aiOutput) aiOutput.innerText = "已重置。";
  });

  if(completeBtn) completeBtn.addEventListener("click", () => {
    markCompleted(id); addScore(10); unlockBadge("starter");
  });

  if(quizBtn){
    quizBtn.addEventListener("click", () => {
      logEvent("quiz_placeholder_"+id);
      addScore(2);
      const out = document.getElementById("quiz-result");
      if(out){ out.innerText = "占位题已确认，+2 分"; out.style.color = "#2ecc71"; }
    });
  }

  if(aiHintBtn) aiHintBtn.addEventListener("click", async () => {
    aiHintBtn.disabled = true;
    if(aiOutput) aiOutput.innerText = "AI 正在生成提示...";
    addScore(-5); logEvent("ai_hint_"+id);
    const ans = await aiCall("/hint", `请给出关于 ${title} 的提示`);
    if(aiOutput) aiOutput.innerText = ans;
    aiHintBtn.disabled = false;
    logEvent("ai_hint_result_"+id);
  });

  if(aiExplainBtn) aiExplainBtn.addEventListener("click", async () => {
    aiExplainBtn.disabled = true;
    if(aiOutput) aiOutput.innerText = "AI 正在生成解释...";
    addScore(-10); logEvent("ai_explain_"+id);
    const ans = await aiCall("/explain", `请解释 ${title}`);
    if(aiOutput) aiOutput.innerText = ans;
    aiExplainBtn.disabled = false;
    logEvent("ai_explain_result_"+id);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // 若页面定义了自定义初始化，则优先使用
  if(typeof window.customAlgoInit === "function"){
    const handled = window.customAlgoInit();
    if(handled) return;
  }
  if(window.ALGO_PAGE_CONFIG){
    initAlgoPage(window.ALGO_PAGE_CONFIG);
  }
});

