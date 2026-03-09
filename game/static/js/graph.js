const sleep = ms => new Promise(res => setTimeout(res, ms));

const graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["E"],
  D: [],
  E: []
};

function renderBFS(status){
  const area = document.getElementById("visual-area");
  if(!area) return;
  area.innerHTML = `
    <div class="small">示例图：A->{B,C}, B->{D}, C->{E}</div>
    <p id="bfs-status" class="small" style="margin-top:8px;color:var(--muted);">${status}</p>
  `;
}

async function playBFS(){
  const visited = [];
  const queue = ["A"];
  const statusEl = () => document.getElementById("bfs-status");
  while(queue.length){
    const node = queue.shift();
    visited.push(node);
    if(statusEl()) statusEl().innerText = `出队 ${node}，访问序列：${visited.join(" -> ")}`;
    await sleep(600);
    for(const nei of graph[node]){
      if(!visited.includes(nei) && !queue.includes(nei)){
        queue.push(nei);
      }
    }
    if(statusEl()) statusEl().innerText += ` | 队列：${queue.join(",")||"空"}`;
    await sleep(600);
  }
  if(statusEl()) statusEl().innerText = `BFS 完成：${visited.join(" -> ")}`;
  logEvent("bfs_done");
}

function initBFS(){
  initCommonUI();
  renderBFS("从 A 开始，使用队列进行层序访问");

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const quizBtn = document.getElementById("placeholder-quiz");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if(playBtn) playBtn.onclick = () => { logEvent("bfs_play"); playBFS(); };
  if(resetBtn) resetBtn.onclick = () => { renderBFS("已重置，准备再次演示"); logEvent("bfs_reset"); };
  if(completeBtn) completeBtn.onclick = () => { markCompleted("graph_bfs"); addScore(10); unlockBadge("starter"); };

  if(quizBtn){
    quizBtn.onclick = () => {
      addScore(2);
      const out = document.getElementById("quiz-result");
      if(out){ out.innerText = "占位题：BFS 先访问谁？起点 A。+2 分"; out.style.color="#2ecc71"; }
    };
  }

  if(aiHintBtn) aiHintBtn.onclick = async () => {
    aiHintBtn.disabled = true;
    const out = document.getElementById("ai-output"); if(out) out.innerText = "AI 正在生成提示...";
    addScore(-5); logEvent("ai_hint_bfs");
    const ans = await aiCall("/hint", "用简短例子解释 BFS 队列的作用");
    if(out) out.innerText = ans;
    aiHintBtn.disabled = false;
  };
  if(aiExplainBtn) aiExplainBtn.onclick = async () => {
    aiExplainBtn.disabled = true;
    const out = document.getElementById("ai-output"); if(out) out.innerText = "AI 正在生成解释...";
    addScore(-10); logEvent("ai_explain_bfs");
    const ans = await aiCall("/explain", "BFS 与 DFS 的主要区别是什么");
    if(out) out.innerText = ans;
    aiExplainBtn.disabled = false;
  };
}

window.customAlgoInit = function(){ initBFS(); return true; };



