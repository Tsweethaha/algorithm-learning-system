// 二叉树遍历页面专用逻辑

// 二叉树节点类
class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// 构建示例树
//        A
//       / \
//      B   C
//     / \ / \
//    D  E F  G
function buildTree() {
  const D = new TreeNode('D');
  const E = new TreeNode('E');
  const F = new TreeNode('F');
  const G = new TreeNode('G');
  const B = new TreeNode('B', D, E);
  const C = new TreeNode('C', F, G);
  const A = new TreeNode('A', B, C);
  return A;
}

let root = buildTree();
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

// 计算树的布局（改进版）
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

// 获取节点在树中的索引（用于布局计算）
function getNodeIndex(node, target, level = 0, index = 0) {
  if (!node) return null;
  if (node === target) return { level, index };
  
  const left = getNodeIndex(node.left, target, level + 1, index * 2);
  if (left) return left;
  
  const right = getNodeIndex(node.right, target, level + 1, index * 2 + 1);
  if (right) return right;
  
  return null;
}

// 渲染二叉树
function renderTree() {
  const svg = document.getElementById("tree-svg");
  if (!svg) return;
  
  // 清空SVG
  svg.innerHTML = "";
  
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
    node.setAttribute("fill", "#2ecc71");
    node.setAttribute("stroke", "#2ecc71");
    node.setAttribute("stroke-width", "2");
  }
  if (text) {
    text.setAttribute("fill", "white");
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

// 更新遍历结果
function updateTraversalResult(result) {
  const resultEl = document.getElementById("traversal-result");
  if (resultEl) {
    resultEl.innerText = `遍历结果：${result.join(" → ")}`;
  }
}

// 前序遍历
async function preorderTraversal() {
  if (isTraversing) return;
  isTraversing = true;
  
  const hintEl = document.getElementById("operation-hint");
  const result = [];
  
  if (hintEl) {
    hintEl.innerText = "前序遍历：根 → 左 → 右";
    hintEl.style.color = "#3498db";
  }
  
  resetNodes();
  updateTraversalResult([]);
  
  updatePseudocode([
    "preorder(node):",
    "  if node is null: return",
    "  visit(node)  // 访问根节点",
    "  preorder(node.left)  // 遍历左子树",
    "  preorder(node.right)  // 遍历右子树"
  ], -1);
  
  await sleep(800);
  
  async function preorder(node) {
    if (!node) return;
    
    // 访问当前节点
    updatePseudocode([
      "preorder(node):",
      "  if node is null: return",
      "  visit(node)  ← 当前执行",
      "  preorder(node.left)  // 遍历左子树",
      "  preorder(node.right)  // 遍历右子树"
    ], 2);
    
    highlightNode(node.value, "#f39c12");
    result.push(node.value);
    updateTraversalResult(result);
    
    if (hintEl) {
      hintEl.innerText = `正在访问：${node.value}（根节点）`;
    }
    
    await sleep(800);
    markVisited(node.value);
    await sleep(300);
    
    // 遍历左子树
    if (node.left) {
      updatePseudocode([
        "preorder(node):",
        "  if node is null: return",
        "  visit(node)",
        "  preorder(node.left)  ← 当前执行（进入左子树）",
        "  preorder(node.right)  // 遍历右子树"
      ], 3);
      
      if (hintEl) {
        hintEl.innerText = `进入左子树：${node.left.value}`;
      }
      await sleep(600);
      await preorder(node.left);
    }
    
    // 遍历右子树
    if (node.right) {
      updatePseudocode([
        "preorder(node):",
        "  if node is null: return",
        "  visit(node)",
        "  preorder(node.left)  // 遍历左子树",
        "  preorder(node.right)  ← 当前执行（进入右子树）"
      ], 4);
      
      if (hintEl) {
        hintEl.innerText = `进入右子树：${node.right.value}`;
      }
      await sleep(600);
      await preorder(node.right);
    }
  }
  
  await preorder(root);
  
  updatePseudocode([
    "✓ 前序遍历完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 前序遍历完成：${result.join(" → ")}`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("tree_preorder", result.join(","));
  await sleep(2000);
  isTraversing = false;
}

// 中序遍历
async function inorderTraversal() {
  if (isTraversing) return;
  isTraversing = true;
  
  const hintEl = document.getElementById("operation-hint");
  const result = [];
  
  if (hintEl) {
    hintEl.innerText = "中序遍历：左 → 根 → 右";
    hintEl.style.color = "#3498db";
  }
  
  resetNodes();
  updateTraversalResult([]);
  
  updatePseudocode([
    "inorder(node):",
    "  if node is null: return",
    "  inorder(node.left)  // 遍历左子树",
    "  visit(node)  // 访问根节点",
    "  inorder(node.right)  // 遍历右子树"
  ], -1);
  
  await sleep(800);
  
  async function inorder(node) {
    if (!node) return;
    
    // 遍历左子树
    if (node.left) {
      updatePseudocode([
        "inorder(node):",
        "  if node is null: return",
        "  inorder(node.left)  ← 当前执行（进入左子树）",
        "  visit(node)  // 访问根节点",
        "  inorder(node.right)  // 遍历右子树"
      ], 2);
      
      if (hintEl) {
        hintEl.innerText = `进入左子树：${node.left.value}`;
      }
      await sleep(600);
      await inorder(node.left);
    }
    
    // 访问当前节点
    updatePseudocode([
      "inorder(node):",
      "  if node is null: return",
      "  inorder(node.left)  // 遍历左子树",
      "  visit(node)  ← 当前执行",
      "  inorder(node.right)  // 遍历右子树"
    ], 3);
    
    highlightNode(node.value, "#f39c12");
    result.push(node.value);
    updateTraversalResult(result);
    
    if (hintEl) {
      hintEl.innerText = `正在访问：${node.value}（根节点）`;
    }
    
    await sleep(800);
    markVisited(node.value);
    await sleep(300);
    
    // 遍历右子树
    if (node.right) {
      updatePseudocode([
        "inorder(node):",
        "  if node is null: return",
        "  inorder(node.left)  // 遍历左子树",
        "  visit(node)",
        "  inorder(node.right)  ← 当前执行（进入右子树）"
      ], 4);
      
      if (hintEl) {
        hintEl.innerText = `进入右子树：${node.right.value}`;
      }
      await sleep(600);
      await inorder(node.right);
    }
  }
  
  await inorder(root);
  
  updatePseudocode([
    "✓ 中序遍历完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 中序遍历完成：${result.join(" → ")}`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("tree_inorder", result.join(","));
  await sleep(2000);
  isTraversing = false;
}

// 后序遍历
async function postorderTraversal() {
  if (isTraversing) return;
  isTraversing = true;
  
  const hintEl = document.getElementById("operation-hint");
  const result = [];
  
  if (hintEl) {
    hintEl.innerText = "后序遍历：左 → 右 → 根";
    hintEl.style.color = "#3498db";
  }
  
  resetNodes();
  updateTraversalResult([]);
  
  updatePseudocode([
    "postorder(node):",
    "  if node is null: return",
    "  postorder(node.left)  // 遍历左子树",
    "  postorder(node.right)  // 遍历右子树",
    "  visit(node)  // 访问根节点"
  ], -1);
  
  await sleep(800);
  
  async function postorder(node) {
    if (!node) return;
    
    // 遍历左子树
    if (node.left) {
      updatePseudocode([
        "postorder(node):",
        "  if node is null: return",
        "  postorder(node.left)  ← 当前执行（进入左子树）",
        "  postorder(node.right)  // 遍历右子树",
        "  visit(node)  // 访问根节点"
      ], 2);
      
      if (hintEl) {
        hintEl.innerText = `进入左子树：${node.left.value}`;
      }
      await sleep(600);
      await postorder(node.left);
    }
    
    // 遍历右子树
    if (node.right) {
      updatePseudocode([
        "postorder(node):",
        "  if node is null: return",
        "  postorder(node.left)  // 遍历左子树",
        "  postorder(node.right)  ← 当前执行（进入右子树）",
        "  visit(node)  // 访问根节点"
      ], 3);
      
      if (hintEl) {
        hintEl.innerText = `进入右子树：${node.right.value}`;
      }
      await sleep(600);
      await postorder(node.right);
    }
    
    // 访问当前节点
    updatePseudocode([
      "postorder(node):",
      "  if node is null: return",
      "  postorder(node.left)  // 遍历左子树",
      "  postorder(node.right)  // 遍历右子树",
      "  visit(node)  ← 当前执行"
    ], 4);
    
    highlightNode(node.value, "#f39c12");
    result.push(node.value);
    updateTraversalResult(result);
    
    if (hintEl) {
      hintEl.innerText = `正在访问：${node.value}（根节点）`;
    }
    
    await sleep(800);
    markVisited(node.value);
    await sleep(300);
  }
  
  await postorder(root);
  
  updatePseudocode([
    "✓ 后序遍历完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 后序遍历完成：${result.join(" → ")}`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("tree_postorder", result.join(","));
  await sleep(2000);
  isTraversing = false;
}

// 层次遍历
async function levelOrderTraversal() {
  if (isTraversing) return;
  isTraversing = true;
  
  const hintEl = document.getElementById("operation-hint");
  const result = [];
  
  if (hintEl) {
    hintEl.innerText = "层次遍历：按层从左到右";
    hintEl.style.color = "#3498db";
  }
  
  resetNodes();
  updateTraversalResult([]);
  
  updatePseudocode([
    "levelOrder(root):",
    "  queue = [root]",
    "  while queue is not empty:",
    "    node = queue.dequeue()",
    "    visit(node)",
    "    if node.left: queue.enqueue(node.left)",
    "    if node.right: queue.enqueue(node.right)"
  ], -1);
  
  await sleep(800);
  
  const queue = [root];
  let level = 0;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      updatePseudocode([
        "levelOrder(root):",
        "  queue = [root]",
        "  while queue is not empty:",
        "    node = queue.dequeue()  ← 当前执行",
        "    visit(node)",
        "    if node.left: queue.enqueue(node.left)",
        "    if node.right: queue.enqueue(node.right)"
      ], 3);
      
      highlightNode(node.value, "#f39c12");
      result.push(node.value);
      updateTraversalResult(result);
      
      if (hintEl) {
        hintEl.innerText = `正在访问：${node.value}（第 ${level + 1} 层）`;
      }
      
      await sleep(800);
      markVisited(node.value);
      await sleep(300);
      
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    level++;
    await sleep(200);
  }
  
  updatePseudocode([
    "✓ 层次遍历完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 层次遍历完成：${result.join(" → ")}`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("tree_levelorder", result.join(","));
  await sleep(2000);
  isTraversing = false;
}

function resetTree() {
  if (isTraversing) return;
  root = buildTree();
  resetNodes();
  renderTree();
  const hintEl = document.getElementById("operation-hint");
  const resultEl = document.getElementById("traversal-result");
  if (hintEl) {
    hintEl.innerText = "已重置为初始树";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  if (resultEl) {
    resultEl.innerText = "";
  }
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("tree_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 二叉树遍历的时间复杂度是 O(n)，因为需要访问每个节点一次
  if (ans === "O(n)") {
    out.innerText = "✔ 正确！二叉树遍历需要访问每个节点一次，时间复杂度是 O(n)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("tree_traversal");
  } else {
    out.innerText = "✖ 错误。二叉树遍历需要访问每个节点一次，时间复杂度是 O(n)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_tree");
  const ans = await aiCall("/hint", "二叉树遍历的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_tree");
  const ans = await aiCall("/explain", "请解释二叉树的前序、中序、后序和层次遍历的区别和实现原理");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initTree() {
  initCommonUI();
  renderTree();
  updatePseudocode(["// 等待操作..."], -1);

  const preorderBtn = document.getElementById("preorder-btn");
  const inorderBtn = document.getElementById("inorder-btn");
  const postorderBtn = document.getElementById("postorder-btn");
  const levelorderBtn = document.getElementById("levelorder-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (preorderBtn) preorderBtn.addEventListener("click", () => { 
    preorderTraversal(); 
    logEvent("tree_preorder_click"); 
  });
  
  if (inorderBtn) inorderBtn.addEventListener("click", () => { 
    inorderTraversal(); 
    logEvent("tree_inorder_click"); 
  });
  
  if (postorderBtn) postorderBtn.addEventListener("click", () => { 
    postorderTraversal(); 
    logEvent("tree_postorder_click"); 
  });
  
  if (levelorderBtn) levelorderBtn.addEventListener("click", () => { 
    levelOrderTraversal(); 
    logEvent("tree_levelorder_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetTree);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("tree_traversal"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initTree);
