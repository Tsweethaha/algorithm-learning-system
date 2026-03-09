// 图遍历页面专用逻辑

// 图的邻接表表示（无向图）
const graph = {
  'A': ['B', 'C', 'D'],
  'B': ['A', 'E'],
  'C': ['A', 'F'],
  'D': ['A', 'E'],
  'E': ['B', 'D', 'F'],
  'F': ['C', 'E']
};

// 节点位置（固定布局）
const nodePositions = {
  'A': { x: 350, y: 50 },
  'B': { x: 200, y: 150 },
  'C': { x: 500, y: 150 },
  'D': { x: 150, y: 250 },
  'E': { x: 350, y: 250 },
  'F': { x: 550, y: 250 }
};

let visited = {};
let isTraversing = false;

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 更新伪代码显示
function updatePseudocode(lines, highlightIndex = -1) {
  const codeContainer = document.getElementById("pseudocode");
  if (!codeContainer) return;
  
  codeContainer.innerHTML = lines.map((line, index) => 
    `<div id="code-line-${index}" class="code-line" ${highlightIndex === index ? 'style="background:#fff3cd; padding:4px; border-left:3px solid #ffc107;"' : ''}>${line}</div>`
  ).join("");
}

// 重置访问状态
function resetVisited() {
  visited = {};
  Object.keys(graph).forEach(node => {
    visited[node] = false;
  });
}

// 渲染图
function renderGraph(currentNode = null, queue = [], stack = []) {
  const svg = document.getElementById("graph-svg");
  if (!svg) return;
  
  // 清空SVG
  svg.innerHTML = "";
  
  // 绘制边
  Object.keys(graph).forEach(node => {
    const pos = nodePositions[node];
    graph[node].forEach(neighbor => {
      // 避免重复绘制边（无向图）
      if (node < neighbor) {
        const neighborPos = nodePositions[neighbor];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pos.x);
        line.setAttribute("y1", pos.y);
        line.setAttribute("x2", neighborPos.x);
        line.setAttribute("y2", neighborPos.y);
        line.setAttribute("stroke", "#4a90e2");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
      }
    });
  });
  
  // 绘制节点
  Object.keys(nodePositions).forEach(node => {
    const pos = nodePositions[node];
    let fillColor = "#ffffff";
    let strokeColor = "#4a90e2";
    let strokeWidth = "2";
    let textColor = "#4a90e2";
    
    // 节点状态
    if (currentNode === node) {
      // 正在访问
      fillColor = "#f39c12";
      strokeColor = "#f39c12";
      strokeWidth = "3";
      textColor = "white";
    } else if (visited[node]) {
      // 已访问
      fillColor = "#2ecc71";
      strokeColor = "#2ecc71";
      strokeWidth = "2";
      textColor = "white";
    } else if (queue.includes(node) || stack.includes(node)) {
      // 在队列或栈中
      fillColor = "#3498db";
      strokeColor = "#3498db";
      strokeWidth = "2";
      textColor = "white";
    }
    
    // 节点圆圈
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pos.x);
    circle.setAttribute("cy", pos.y);
    circle.setAttribute("r", "25");
    circle.setAttribute("fill", fillColor);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("stroke-width", strokeWidth);
    circle.setAttribute("id", `node-${node}`);
    circle.classList.add("graph-node");
    svg.appendChild(circle);
    
    // 节点文本
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-weight", "600");
    text.setAttribute("fill", textColor);
    text.textContent = node;
    text.setAttribute("id", `node-${node}-text`);
    svg.appendChild(text);
    
    // 起始节点标注
    if (node === 'A') {
      const startLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      startLabel.setAttribute("x", pos.x);
      startLabel.setAttribute("y", pos.y - 35);
      startLabel.setAttribute("text-anchor", "middle");
      startLabel.setAttribute("font-size", "11");
      startLabel.setAttribute("fill", "#e74c3c");
      startLabel.setAttribute("font-weight", "600");
      startLabel.textContent = "Start";
      svg.appendChild(startLabel);
    }
  });
}

// BFS遍历
async function bfsTraversal() {
  if (isTraversing) return;
  isTraversing = true;
  
  const hintEl = document.getElementById("operation-hint");
  const resultEl = document.getElementById("traversal-result");
  const bfsBtn = document.getElementById("bfs-btn");
  const dfsBtn = document.getElementById("dfs-btn");
  
  // 禁用按钮
  if (bfsBtn) bfsBtn.disabled = true;
  if (dfsBtn) dfsBtn.disabled = true;
  
  resetVisited();
  const queue = ['A'];
  const result = [];
  
  if (hintEl) {
    hintEl.innerText = "BFS：从节点 A 开始，使用队列进行广度优先遍历";
    hintEl.style.color = "#3498db";
  }
  if (resultEl) resultEl.innerText = "";
  
  updatePseudocode([
    "BFS(start):",
    "  queue = [start]",
    "  visited[start] = true",
    "  while queue is not empty:",
    "    node = queue.dequeue()",
    "    visit(node)",
    "    for each neighbor of node:",
    "      if not visited[neighbor]:",
    "        visited[neighbor] = true",
    "        queue.enqueue(neighbor)"
  ], -1);
  
  visited['A'] = true;
  renderGraph(null, ['A'], []);
  await sleep(800);
  
  while (queue.length > 0) {
    // 出队
    const node = queue.shift();
    
    updatePseudocode([
      "BFS(start):",
      "  queue = [start]",
      "  visited[start] = true",
      "  while queue is not empty:",
      "    node = queue.dequeue()  ← 当前执行",
      "    visit(node)",
      "    for each neighbor of node:",
      "      if not visited[neighbor]:",
      "        visited[neighbor] = true",
      "        queue.enqueue(neighbor)"
    ], 4);
    
    if (hintEl) {
      hintEl.innerText = `节点 ${node} 出队并访问`;
      hintEl.style.color = "#f39c12";
    }
    
    renderGraph(node, queue, []);
    await sleep(800);
    
    result.push(node);
    if (resultEl) {
      resultEl.innerText = `遍历结果：${result.join(" → ")}`;
    }
    
    // 访问节点
    updatePseudocode([
      "BFS(start):",
      "  queue = [start]",
      "  visited[start] = true",
      "  while queue is not empty:",
      "    node = queue.dequeue()",
      "    visit(node)  ← 当前执行",
      "    for each neighbor of node:",
      "      if not visited[neighbor]:",
      "        visited[neighbor] = true",
      "        queue.enqueue(neighbor)"
    ], 5);
    
    await sleep(600);
    
    // 标记为已访问
    visited[node] = true;
    renderGraph(node, queue, []);
    await sleep(400);
    
    // 遍历邻居
    updatePseudocode([
      "BFS(start):",
      "  queue = [start]",
      "  visited[start] = true",
      "  while queue is not empty:",
      "    node = queue.dequeue()",
      "    visit(node)",
      "    for each neighbor of node:  ← 当前执行",
      "      if not visited[neighbor]:",
      "        visited[neighbor] = true",
      "        queue.enqueue(neighbor)"
    ], 6);
    
    const neighbors = graph[node];
    for (const neighbor of neighbors) {
      if (!visited[neighbor] && !queue.includes(neighbor)) {
        updatePseudocode([
          "BFS(start):",
          "  queue = [start]",
          "  visited[start] = true",
          "  while queue is not empty:",
          "    node = queue.dequeue()",
          "    visit(node)",
          "    for each neighbor of node:",
          "      if not visited[neighbor]:  ← 当前执行",
          "        visited[neighbor] = true",
          "        queue.enqueue(neighbor)"
        ], 7);
        
        visited[neighbor] = true;
        queue.push(neighbor);
        
        if (hintEl) {
          hintEl.innerText = `节点 ${neighbor} 入队`;
          hintEl.style.color = "#2ecc71";
        }
        
        renderGraph(node, queue, []);
        await sleep(600);
      }
    }
    
    // 恢复为已访问状态
    renderGraph(null, queue, []);
    await sleep(300);
  }
  
  updatePseudocode([
    "✓ BFS 遍历完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ BFS 遍历完成：${result.join(" → ")}`;
    hintEl.style.color = "#2ecc71";
  }
  
  renderGraph();
  logEvent("graph_bfs", result.join(","));
  await sleep(2000);
  
  // 恢复按钮
  if (bfsBtn) bfsBtn.disabled = false;
  if (dfsBtn) dfsBtn.disabled = false;
  isTraversing = false;
}

// DFS遍历
async function dfsTraversal() {
  if (isTraversing) return;
  isTraversing = true;
  
  const hintEl = document.getElementById("operation-hint");
  const resultEl = document.getElementById("traversal-result");
  const bfsBtn = document.getElementById("bfs-btn");
  const dfsBtn = document.getElementById("dfs-btn");
  
  // 禁用按钮
  if (bfsBtn) bfsBtn.disabled = true;
  if (dfsBtn) dfsBtn.disabled = true;
  
  resetVisited();
  const result = [];
  
  if (hintEl) {
    hintEl.innerText = "DFS：从节点 A 开始，使用递归进行深度优先遍历";
    hintEl.style.color = "#3498db";
  }
  if (resultEl) resultEl.innerText = "";
  
  updatePseudocode([
    "DFS(node):",
    "  visited[node] = true",
    "  visit(node)",
    "  for each neighbor of node:",
    "    if not visited[neighbor]:",
    "      DFS(neighbor)"
  ], -1);
  
  renderGraph();
  await sleep(800);
  
  async function dfs(node) {
    if (visited[node]) return;
    
    // 访问节点
    updatePseudocode([
      "DFS(node):",
      "  visited[node] = true  ← 当前执行",
      "  visit(node)",
      "  for each neighbor of node:",
      "    if not visited[neighbor]:",
      "      DFS(neighbor)"
    ], 1);
    
    visited[node] = true;
    result.push(node);
    
    if (hintEl) {
      hintEl.innerText = `递归进入节点 ${node}`;
      hintEl.style.color = "#f39c12";
    }
    if (resultEl) {
      resultEl.innerText = `遍历结果：${result.join(" → ")}`;
    }
    
    renderGraph(node, [], []);
    await sleep(800);
    
    // 访问节点
    updatePseudocode([
      "DFS(node):",
      "  visited[node] = true",
      "  visit(node)  ← 当前执行",
      "  for each neighbor of node:",
      "    if not visited[neighbor]:",
      "      DFS(neighbor)"
    ], 2);
    
    await sleep(600);
    
    // 遍历邻居
    updatePseudocode([
      "DFS(node):",
      "  visited[node] = true",
      "  visit(node)",
      "  for each neighbor of node:  ← 当前执行",
      "    if not visited[neighbor]:",
      "      DFS(neighbor)"
    ], 3);
    
    const neighbors = graph[node];
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        updatePseudocode([
          "DFS(node):",
          "  visited[node] = true",
          "  visit(node)",
          "  for each neighbor of node:",
          "    if not visited[neighbor]:  ← 当前执行",
          "      DFS(neighbor)"
        ], 4);
        
        if (hintEl) {
          hintEl.innerText = `从节点 ${node} 递归进入节点 ${neighbor}`;
          hintEl.style.color = "#3498db";
        }
        
        await sleep(600);
        
        updatePseudocode([
          "DFS(node):",
          "  visited[node] = true",
          "  visit(node)",
          "  for each neighbor of node:",
          "    if not visited[neighbor]:",
          "      DFS(neighbor)  ← 当前执行（递归）"
        ], 5);
        
        await dfs(neighbor);
        
        // 回溯
        if (hintEl) {
          hintEl.innerText = `回溯到节点 ${node}`;
          hintEl.style.color = "#9b59b6";
        }
        renderGraph(node, [], []);
        await sleep(500);
      }
    }
    
    // 恢复为已访问状态
    renderGraph(null, [], []);
    await sleep(300);
  }
  
  await dfs('A');
  
  updatePseudocode([
    "✓ DFS 遍历完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ DFS 遍历完成：${result.join(" → ")}`;
    hintEl.style.color = "#2ecc71";
  }
  
  renderGraph();
  logEvent("graph_dfs", result.join(","));
  await sleep(2000);
  
  // 恢复按钮
  if (bfsBtn) bfsBtn.disabled = false;
  if (dfsBtn) dfsBtn.disabled = false;
  isTraversing = false;
}

function resetGraph() {
  if (isTraversing) return;
  resetVisited();
  renderGraph();
  const hintEl = document.getElementById("operation-hint");
  const resultEl = document.getElementById("traversal-result");
  if (hintEl) {
    hintEl.innerText = "已重置图状态";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  if (resultEl) resultEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("graph_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 图的BFS和DFS遍历的时间复杂度是 O(V+E)
  if (ans === "O(V+E)") {
    out.innerText = "✔ 正确！图的 BFS 和 DFS 遍历的时间复杂度是 O(V+E)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("graph_bfs");
  } else {
    out.innerText = "✖ 错误。图的 BFS 和 DFS 遍历的时间复杂度是 O(V+E)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_graph");
  const ans = await aiCall("/hint", "图的 BFS 和 DFS 遍历的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_graph");
  const ans = await aiCall("/explain", "请解释图的 BFS 和 DFS 遍历的区别，以及它们的时间复杂度");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initGraph() {
  initCommonUI();
  resetVisited();
  renderGraph();
  updatePseudocode(["// 等待操作..."], -1);

  const bfsBtn = document.getElementById("bfs-btn");
  const dfsBtn = document.getElementById("dfs-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (bfsBtn) bfsBtn.addEventListener("click", () => { 
    bfsTraversal(); 
    logEvent("graph_bfs_click"); 
  });
  
  if (dfsBtn) dfsBtn.addEventListener("click", () => { 
    dfsTraversal(); 
    logEvent("graph_dfs_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetGraph);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("graph_bfs"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initGraph);

