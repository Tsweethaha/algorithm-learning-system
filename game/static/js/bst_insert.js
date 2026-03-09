// BST插入页面专用逻辑

// BST节点类
class BSTNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// 预设插入序列
const INSERT_SEQUENCE = [50, 30, 70, 20, 40, 60, 80];
let insertIndex = 0;
let root = null;
let isInserting = false;

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 更新伪代码显示
function updatePseudocode(lines, highlightIndex = -1) {
  const codeContainer = document.getElementById("pseudocode");
  if (!codeContainer) return;
  
  codeContainer.innerHTML = lines.map((line, index) => 
    `<div id="code-line-${index}" class="code-line" ${highlightIndex === index ? 'style="background:#fff3cd; padding:4px; border-left:3px solid #ffc107;"' : ''}>${line}</div>`
  ).join("");
}

// 计算树的布局（改进版，支持动态添加节点）
function calculateLayout(node, level = 0, offset = 0, positions = {}) {
  if (!node) return { positions, width: 0 };
  
  const nodeId = `node-${node.value}`;
  
  // 计算左子树布局
  const leftLayout = calculateLayout(node.left, level + 1, offset, positions);
  const leftWidth = leftLayout.width;
  
  // 当前节点的x坐标
  const x = offset + leftWidth + 50; // 50是节点间距的一半（节点更紧凑）
  const y = 40 + level * 80; // 减小层间距
  
  positions[nodeId] = { x, y, value: node.value, node };
  
  // 计算右子树布局
  const rightLayout = calculateLayout(node.right, level + 1, x + 50, positions);
  const rightWidth = rightLayout.width;
  
  // 当前子树的总宽度
  const totalWidth = leftWidth + rightWidth + 100; // 100是节点宽度（更紧凑）
  
  return { positions, width: totalWidth };
}

// 居中布局
function centerLayout(positions) {
  if (Object.keys(positions).length === 0) return positions;
  
  // 找到最左和最右的x坐标
  let minX = Infinity;
  let maxX = -Infinity;
  
  Object.values(positions).forEach(pos => {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
  });
  
  // 计算中心点
  const centerX = 350; // SVG中心（700/2）
  const currentCenter = (minX + maxX) / 2;
  const offset = centerX - currentCenter;
  
  // 调整所有节点位置
  Object.keys(positions).forEach(nodeId => {
    positions[nodeId].x += offset;
  });
  
  return positions;
}

// 渲染BST
function renderBST() {
  const svg = document.getElementById("tree-svg");
  if (!svg) return;
  
  // 清空SVG
  svg.innerHTML = "";
  
  if (!root) {
    // 空树
    const emptyMsg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    emptyMsg.setAttribute("x", 350);
    emptyMsg.setAttribute("y", 175);
    emptyMsg.setAttribute("text-anchor", "middle");
    emptyMsg.setAttribute("font-size", "16");
    emptyMsg.setAttribute("fill", "var(--muted)");
    emptyMsg.textContent = "Empty BST";
    svg.appendChild(emptyMsg);
    return;
  }
  
  const layout = calculateLayout(root, 0, 0, {});
  const positions = centerLayout(layout.positions);
  
  // 绘制连线
  Object.keys(positions).forEach(nodeId => {
    const pos = positions[nodeId];
    const node = pos.node;
    
    if (node.left) {
      const leftId = `node-${node.left.value}`;
      const leftPos = positions[leftId];
      if (leftPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pos.x);
        line.setAttribute("y1", pos.y + 25);
        line.setAttribute("x2", leftPos.x);
        line.setAttribute("y2", leftPos.y);
        line.setAttribute("stroke", "#4a90e2");
        line.setAttribute("stroke-width", "2");
        line.classList.add("tree-line");
        svg.appendChild(line);
      }
    }
    
    if (node.right) {
      const rightId = `node-${node.right.value}`;
      const rightPos = positions[rightId];
      if (rightPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pos.x);
        line.setAttribute("y1", pos.y + 25);
        line.setAttribute("x2", rightPos.x);
        line.setAttribute("y2", rightPos.y);
        line.setAttribute("stroke", "#4a90e2");
        line.setAttribute("stroke-width", "2");
        line.classList.add("tree-line");
        svg.appendChild(line);
      }
    }
  });
  
  // 绘制节点
  Object.keys(positions).forEach(nodeId => {
    const pos = positions[nodeId];
    
    // 节点圆圈（缩小尺寸）
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pos.x);
    circle.setAttribute("cy", pos.y + 25);
    circle.setAttribute("r", "20"); // 从25改为20
    circle.setAttribute("fill", "#ffffff");
    circle.setAttribute("stroke", "#4a90e2");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("id", nodeId);
    circle.classList.add("tree-node");
    circle.dataset.value = pos.value;
    svg.appendChild(circle);
    
    // 节点文本（缩小字体）
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y + 29);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14"); // 从16改为14
    text.setAttribute("font-weight", "600");
    text.setAttribute("fill", "#4a90e2");
    text.textContent = pos.value;
    text.setAttribute("id", `${nodeId}-text`);
    svg.appendChild(text);
    
    // 根节点标注（缩小字体）
    if (pos.node === root) {
      const rootLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      rootLabel.setAttribute("x", pos.x);
      rootLabel.setAttribute("y", pos.y + 8);
      rootLabel.setAttribute("text-anchor", "middle");
      rootLabel.setAttribute("font-size", "11"); // 从12改为11
      rootLabel.setAttribute("fill", "#e74c3c");
      rootLabel.setAttribute("font-weight", "600");
      rootLabel.textContent = "Root";
      svg.appendChild(rootLabel);
    }
  });
}

// 高亮节点
function highlightNode(value, color = "#f39c12") {
  const node = document.getElementById(`node-${value}`);
  const text = document.getElementById(`node-${value}-text`);
  if (node) {
    node.setAttribute("fill", color);
    node.setAttribute("stroke", color);
    node.setAttribute("stroke-width", "3");
  }
  if (text) {
    text.setAttribute("fill", "white");
  }
}

// 标记节点为已访问
function markVisited(value) {
  const node = document.getElementById(`node-${value}`);
  const text = document.getElementById(`node-${value}-text`);
  if (node) {
    node.setAttribute("fill", "#e8f4f8");
    node.setAttribute("stroke", "#4a90e2");
    node.setAttribute("stroke-width", "2");
  }
  if (text) {
    text.setAttribute("fill", "#4a90e2");
  }
}

// 重置所有节点
function resetNodes() {
  const nodes = document.querySelectorAll(".tree-node");
  const texts = document.querySelectorAll("text[id$='-text']");
  nodes.forEach(node => {
    node.setAttribute("fill", "#ffffff");
    node.setAttribute("stroke", "#4a90e2");
    node.setAttribute("stroke-width", "2");
  });
  texts.forEach(text => {
    text.setAttribute("fill", "#4a90e2");
  });
}

// 插入节点（带动画）
async function insertNode() {
  if (isInserting) return;
  if (insertIndex >= INSERT_SEQUENCE.length) {
    const hintEl = document.getElementById("operation-hint");
    if (hintEl) {
      hintEl.innerText = "所有节点已插入完成！";
      hintEl.style.color = "#2ecc71";
    }
    return;
  }
  
  isInserting = true;
  const value = INSERT_SEQUENCE[insertIndex];
  insertIndex++;
  
  const hintEl = document.getElementById("operation-hint");
  const comparisonEl = document.getElementById("comparison-hint");
  
  if (hintEl) {
    hintEl.innerText = `正在插入节点：${value}`;
    hintEl.style.color = "#3498db";
  }
  
  resetNodes();
  
  updatePseudocode([
    "insert(root, value):",
    "  if root is null:",
    "    return new Node(value)",
    "  if value < root.value:",
    "    root.left = insert(root.left, value)",
    "  else if value > root.value:",
    "    root.right = insert(root.right, value)",
    "  return root"
  ], -1);
  
  await sleep(800);
  
  // 如果树为空
  if (!root) {
    updatePseudocode([
      "insert(root, value):",
      "  if root is null:  ← 当前执行",
      "    return new Node(value)",
      "  if value < root.value:",
      "    root.left = insert(root.left, value)",
      "  else if value > root.value:",
      "    root.right = insert(root.right, value)",
      "  return root"
    ], 1);
    
    if (hintEl) {
      hintEl.innerText = `树为空，创建根节点：${value}`;
    }
    await sleep(800);
    
    root = new BSTNode(value);
    renderBST();
    
    // 高亮新节点
    await sleep(200);
    highlightNode(value, "#2ecc71");
    await sleep(800);
    markVisited(value);
    
    updatePseudocode([
      "✓ 插入完成！新节点成为根节点"
    ], -1);
    
    if (hintEl) {
      hintEl.innerText = `✓ 插入完成！${value} 成为根节点`;
      hintEl.style.color = "#2ecc71";
    }
    if (comparisonEl) comparisonEl.innerText = "";
    
    logEvent("bst_insert", `value=${value}, root`);
    await sleep(1500);
    isInserting = false;
    return;
  }
  
  // 从根节点开始比较
  let current = root;
  const path = [];
  
  updatePseudocode([
    "insert(root, value):",
    "  if root is null:",
    "    return new Node(value)",
    "  if value < root.value:  ← 当前执行",
    "    root.left = insert(root.left, value)",
    "  else if value > root.value:",
    "    root.right = insert(root.right, value)",
    "  return root"
  ], 3);
  
  while (true) {
    // 高亮当前节点
    highlightNode(current.value, "#f39c12");
    path.push(current.value);
    
    if (comparisonEl) {
      comparisonEl.innerText = `比较路径：${path.join(" → ")}`;
    }
    
    await sleep(600);
    
    if (value < current.value) {
      // 向左子树移动
      updatePseudocode([
        "insert(root, value):",
        "  if root is null:",
        "    return new Node(value)",
        "  if value < root.value:  ← 当前执行",
        "    root.left = insert(root.left, value)  ← 向左子树",
        "  else if value > root.value:",
        "    root.right = insert(root.right, value)",
        "  return root"
      ], 3);
      
      if (hintEl) {
        hintEl.innerText = `${value} < ${current.value} → 向左子树移动`;
      }
      
      markVisited(current.value);
      await sleep(800);
      
      if (current.left) {
        current = current.left;
        await sleep(400);
      } else {
        // 找到插入位置
        updatePseudocode([
          "insert(root, value):",
          "  if root is null:  ← 找到插入位置",
          "    return new Node(value)  ← 当前执行",
          "  if value < root.value:",
          "    root.left = insert(root.left, value)",
          "  else if value > root.value:",
          "    root.right = insert(root.right, value)",
          "  return root"
        ], 2);
        
        if (hintEl) {
          hintEl.innerText = `找到插入位置：${value} 将成为 ${current.value} 的左子节点`;
        }
        await sleep(800);
        
        // 插入新节点
        current.left = new BSTNode(value);
        renderBST();
        
        // 高亮新节点
        await sleep(200);
        highlightNode(value, "#2ecc71");
        await sleep(800);
        markVisited(value);
        markVisited(current.value);
        
        updatePseudocode([
          "✓ 插入完成！新节点已连接到左子树"
        ], -1);
        
        if (hintEl) {
          hintEl.innerText = `✓ 插入完成！${value} 成为 ${current.value} 的左子节点`;
          hintEl.style.color = "#2ecc71";
        }
        if (comparisonEl) comparisonEl.innerText = "";
        
        logEvent("bst_insert", `value=${value}, path=${path.join(",")}`);
        await sleep(1500);
        isInserting = false;
        return;
      }
    } else if (value > current.value) {
      // 向右子树移动
      updatePseudocode([
        "insert(root, value):",
        "  if root is null:",
        "    return new Node(value)",
        "  if value < root.value:",
        "    root.left = insert(root.left, value)",
        "  else if value > root.value:  ← 当前执行",
        "    root.right = insert(root.right, value)  ← 向右子树",
        "  return root"
      ], 5);
      
      if (hintEl) {
        hintEl.innerText = `${value} > ${current.value} → 向右子树移动`;
      }
      
      markVisited(current.value);
      await sleep(800);
      
      if (current.right) {
        current = current.right;
        await sleep(400);
      } else {
        // 找到插入位置
        updatePseudocode([
          "insert(root, value):",
          "  if root is null:  ← 找到插入位置",
          "    return new Node(value)  ← 当前执行",
          "  if value < root.value:",
          "    root.left = insert(root.left, value)",
          "  else if value > root.value:",
          "    root.right = insert(root.right, value)",
          "  return root"
        ], 2);
        
        if (hintEl) {
          hintEl.innerText = `找到插入位置：${value} 将成为 ${current.value} 的右子节点`;
        }
        await sleep(800);
        
        // 插入新节点
        current.right = new BSTNode(value);
        renderBST();
        
        // 高亮新节点
        await sleep(200);
        highlightNode(value, "#2ecc71");
        await sleep(800);
        markVisited(value);
        markVisited(current.value);
        
        updatePseudocode([
          "✓ 插入完成！新节点已连接到右子树"
        ], -1);
        
        if (hintEl) {
          hintEl.innerText = `✓ 插入完成！${value} 成为 ${current.value} 的右子节点`;
          hintEl.style.color = "#2ecc71";
        }
        if (comparisonEl) comparisonEl.innerText = "";
        
        logEvent("bst_insert", `value=${value}, path=${path.join(",")}`);
        await sleep(1500);
        isInserting = false;
        return;
      }
    } else {
      // 值已存在（BST不允许重复值）
      if (hintEl) {
        hintEl.innerText = `值 ${value} 已存在于树中，BST不允许重复值`;
        hintEl.style.color = "#e74c3c";
      }
      markVisited(current.value);
      await sleep(1500);
      isInserting = false;
      return;
    }
  }
}

function resetBST() {
  if (isInserting) return;
  root = null;
  insertIndex = 0;
  renderBST();
  const hintEl = document.getElementById("operation-hint");
  const comparisonEl = document.getElementById("comparison-hint");
  if (hintEl) {
    hintEl.innerText = "已重置为空树";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  if (comparisonEl) comparisonEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("bst_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // BST插入的时间复杂度：平均O(log n)，最坏O(n)（退化为链表）
  // 通常我们说BST操作是O(log n)
  if (ans === "O(log n)") {
    out.innerText = "✔ 正确！BST插入的平均时间复杂度是 O(log n)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("bst_insert");
  } else {
    out.innerText = "✖ 错误。BST插入的平均时间复杂度是 O(log n)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_bst");
  const ans = await aiCall("/hint", "BST插入操作的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_bst");
  const ans = await aiCall("/explain", "请解释BST插入操作的实现原理，以及为什么时间复杂度是O(log n)");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initBST() {
  initCommonUI();
  renderBST();
  updatePseudocode(["// 等待操作..."], -1);

  const insertBtn = document.getElementById("insert-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (insertBtn) insertBtn.addEventListener("click", () => { 
    insertNode(); 
    logEvent("bst_insert_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetBST);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("bst_insert"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initBST);
