// 堆页面专用逻辑

// 初始数组
const DEFAULT_ARRAY = [4, 10, 3, 5, 1];
let heapArray = [...DEFAULT_ARRAY];
let isBuilding = false;

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 更新伪代码显示
function updatePseudocode(lines, highlightIndex = -1) {
  const codeContainer = document.getElementById("pseudocode");
  if (!codeContainer) return;
  
  codeContainer.innerHTML = lines.map((line, index) => 
    `<div id="code-line-${index}" class="code-line" ${highlightIndex === index ? 'style="background:#fff3cd; padding:4px; border-left:3px solid #ffc107;"' : ''}>${line}</div>`
  ).join("");
}

// 计算树的布局（基于数组索引）
function calculateHeapLayout(arr, level = 0, index = 0, offset = 0, positions = {}) {
  if (index >= arr.length) return { positions, width: 0 };
  
  const nodeId = `node-${index}`;
  
  // 计算左子树布局
  const leftIdx = leftChild(index);
  const leftLayout = calculateHeapLayout(arr, level + 1, leftIdx, offset, positions);
  const leftWidth = leftLayout.width;
  
  // 当前节点的x坐标
  const x = offset + leftWidth + 50;
  const y = 40 + level * 80;
  
  positions[nodeId] = { x, y, value: arr[index], index };
  
  // 计算右子树布局
  const rightIdx = rightChild(index);
  const rightLayout = calculateHeapLayout(arr, level + 1, rightIdx, x + 50, positions);
  const rightWidth = rightLayout.width;
  
  // 当前子树的总宽度
  const totalWidth = leftWidth + rightWidth + 100;
  
  return { positions, width: totalWidth };
}

// 居中布局
function centerHeapLayout(positions) {
  if (Object.keys(positions).length === 0) return positions;
  
  let minX = Infinity;
  let maxX = -Infinity;
  
  Object.values(positions).forEach(pos => {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
  });
  
  const centerX = 350; // SVG中心
  const currentCenter = (minX + maxX) / 2;
  const offset = centerX - currentCenter;
  
  Object.keys(positions).forEach(nodeId => {
    positions[nodeId].x += offset;
  });
  
  return positions;
}

// 渲染堆树
function renderHeap(highlightIndices = [], swapIndices = []) {
  const svg = document.getElementById("heap-svg");
  if (!svg) return;
  
  // 清空SVG
  svg.innerHTML = "";
  
  if (heapArray.length === 0) {
    const emptyMsg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    emptyMsg.setAttribute("x", 350);
    emptyMsg.setAttribute("y", 175);
    emptyMsg.setAttribute("text-anchor", "middle");
    emptyMsg.setAttribute("font-size", "16");
    emptyMsg.setAttribute("fill", "var(--muted)");
    emptyMsg.textContent = "Empty Heap";
    svg.appendChild(emptyMsg);
    return;
  }
  
  const layout = calculateHeapLayout(heapArray, 0, 0, 0, {});
  const positions = centerHeapLayout(layout.positions);
  
  // 绘制连线
  Object.keys(positions).forEach(nodeId => {
    const pos = positions[nodeId];
    const index = parseInt(nodeId.split('-')[1]);
    
    const leftIdx = leftChild(index);
    const rightIdx = rightChild(index);
    
    if (leftIdx < heapArray.length) {
      const leftId = `node-${leftIdx}`;
      const leftPos = positions[leftId];
      if (leftPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pos.x);
        line.setAttribute("y1", pos.y + 25);
        line.setAttribute("x2", leftPos.x);
        line.setAttribute("y2", leftPos.y);
        line.setAttribute("stroke", "#4a90e2");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
      }
    }
    
    if (rightIdx < heapArray.length) {
      const rightId = `node-${rightIdx}`;
      const rightPos = positions[rightId];
      if (rightPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pos.x);
        line.setAttribute("y1", pos.y + 25);
        line.setAttribute("x2", rightPos.x);
        line.setAttribute("y2", rightPos.y);
        line.setAttribute("stroke", "#4a90e2");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
      }
    }
  });
  
  // 绘制节点
  Object.keys(positions).forEach(nodeId => {
    const pos = positions[nodeId];
    const index = parseInt(nodeId.split('-')[1]);
    
    let fillColor = "#ffffff";
    let strokeColor = "#4a90e2";
    let strokeWidth = "2";
    
    // 高亮当前操作的节点
    if (highlightIndices.includes(index)) {
      fillColor = "#f39c12";
      strokeColor = "#f39c12";
      strokeWidth = "3";
    }
    
    // 高亮交换的节点
    if (swapIndices.includes(index)) {
      fillColor = "#e74c3c";
      strokeColor = "#e74c3c";
      strokeWidth = "3";
    }
    
    // 节点圆圈
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pos.x);
    circle.setAttribute("cy", pos.y + 25);
    circle.setAttribute("r", "20");
    circle.setAttribute("fill", fillColor);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("stroke-width", strokeWidth);
    circle.setAttribute("id", nodeId);
    circle.classList.add("heap-node");
    circle.dataset.index = index;
    svg.appendChild(circle);
    
    // 节点文本（值）
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y + 29);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-weight", "600");
    text.setAttribute("fill", highlightIndices.includes(index) || swapIndices.includes(index) ? "white" : "#4a90e2");
    text.textContent = pos.value;
    text.setAttribute("id", `${nodeId}-text`);
    svg.appendChild(text);
    
    // 节点索引标签
    const indexLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    indexLabel.setAttribute("x", pos.x);
    indexLabel.setAttribute("y", pos.y + 8);
    indexLabel.setAttribute("text-anchor", "middle");
    indexLabel.setAttribute("font-size", "11");
    indexLabel.setAttribute("fill", "#999");
    indexLabel.setAttribute("font-weight", "600");
    indexLabel.textContent = `[${index}]`;
    svg.appendChild(indexLabel);
    
    // 根节点标注
    if (index === 0) {
      const rootLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      rootLabel.setAttribute("x", pos.x);
      rootLabel.setAttribute("y", pos.y - 5);
      rootLabel.setAttribute("text-anchor", "middle");
      rootLabel.setAttribute("font-size", "11");
      rootLabel.setAttribute("fill", "#e74c3c");
      rootLabel.setAttribute("font-weight", "600");
      rootLabel.textContent = "Root";
      svg.appendChild(rootLabel);
    }
  });
}

// 获取左子节点索引
function leftChild(index) {
  return 2 * index + 1;
}

// 获取右子节点索引
function rightChild(index) {
  return 2 * index + 2;
}

// 获取父节点索引
function parent(index) {
  return Math.floor((index - 1) / 2);
}

// 向下调整（Heapify Down）- 大根堆
async function heapifyDownMax(arr, size, index, hintEl) {
  let largest = index;
  const left = leftChild(index);
  const right = rightChild(index);
  
  // 显示当前比较
  if (hintEl) {
    const leftVal = left < size ? arr[left] : null;
    const rightVal = right < size ? arr[right] : null;
    hintEl.innerText = `比较父节点 ${arr[index]} (索引${index}) 与子节点 ${leftVal !== null ? leftVal + '(左,' + left + ')' : '无'} ${rightVal !== null ? rightVal + '(右,' + right + ')' : '无'}`;
    hintEl.style.color = "#f39c12";
  }
  
  updatePseudocode([
    "heapifyDown(arr, i, n):",
    "  largest = i",
    "  left = 2*i + 1",
    "  right = 2*i + 2",
    "  if left < n and arr[left] > arr[largest]:",
    "    largest = left",
    "  if right < n and arr[right] > arr[largest]:",
    "    largest = right",
    "  if largest != i:",
    "    swap(arr[i], arr[largest])",
    "    heapifyDown(arr, largest, n)"
  ], 1);
  
  renderHeap([index, left, right].filter(i => i < size));
  await sleep(800);
  
  // 比较左子节点
  if (left < size && arr[left] > arr[largest]) {
    largest = left;
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  largest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] > arr[largest]:  ← 当前执行",
      "    largest = left",
      "  if right < n and arr[right] > arr[largest]:",
      "    largest = right",
      "  if largest != i:",
      "    swap(arr[i], arr[largest])",
      "    heapifyDown(arr, largest, n)"
    ], 4);
    renderHeap([index, left, right].filter(i => i < size));
    await sleep(600);
  }
  
  // 比较右子节点
  if (right < size && arr[right] > arr[largest]) {
    largest = right;
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  largest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] > arr[largest]:",
      "    largest = left",
      "  if right < n and arr[right] > arr[largest]:  ← 当前执行",
      "    largest = right",
      "  if largest != i:",
      "    swap(arr[i], arr[largest])",
      "    heapifyDown(arr, largest, n)"
    ], 6);
    renderHeap([index, left, right].filter(i => i < size));
    await sleep(600);
  }
  
  // 如果需要交换
  if (largest !== index) {
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  largest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] > arr[largest]:",
      "    largest = left",
      "  if right < n and arr[right] > arr[largest]:",
      "    largest = right",
      "  if largest != i:  ← 当前执行",
      "    swap(arr[i], arr[largest])",
      "    heapifyDown(arr, largest, n)"
    ], 8);
    
    if (hintEl) {
      hintEl.innerText = `交换 ${arr[index]} (索引${index}) 与 ${arr[largest]} (索引${largest})`;
      hintEl.style.color = "#e74c3c";
    }
    
    // 高亮交换的元素
    renderHeap([index, largest], [index, largest]);
    await sleep(600);
    
    // 执行交换
    [arr[index], arr[largest]] = [arr[largest], arr[index]];
    heapArray = [...arr];
    
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  largest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] > arr[largest]:",
      "    largest = left",
      "  if right < n and arr[right] > arr[largest]:",
      "    largest = right",
      "  if largest != i:",
      "    swap(arr[i], arr[largest])  ← 当前执行",
      "    heapifyDown(arr, largest, n)"
    ], 9);
    
    renderHeap([index, largest], [index, largest]);
    await sleep(800);
    
    // 递归调整
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  largest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] > arr[largest]:",
      "    largest = left",
      "  if right < n and arr[right] > arr[largest]:",
      "    largest = right",
      "  if largest != i:",
      "    swap(arr[i], arr[largest])",
      "    heapifyDown(arr, largest, n)  ← 当前执行（递归）"
    ], 10);
    
    await sleep(600);
    await heapifyDownMax(arr, size, largest, hintEl);
  } else {
    if (hintEl) {
      hintEl.innerText = `节点 ${arr[index]} (索引${index}) 已满足堆性质`;
      hintEl.style.color = "#2ecc71";
    }
    renderHeap([index]);
    await sleep(600);
  }
}

// 向下调整（Heapify Down）- 小根堆
async function heapifyDownMin(arr, size, index, hintEl) {
  let smallest = index;
  const left = leftChild(index);
  const right = rightChild(index);
  
  // 显示当前比较
  if (hintEl) {
    const leftVal = left < size ? arr[left] : null;
    const rightVal = right < size ? arr[right] : null;
    hintEl.innerText = `比较父节点 ${arr[index]} (索引${index}) 与子节点 ${leftVal !== null ? leftVal + '(左,' + left + ')' : '无'} ${rightVal !== null ? rightVal + '(右,' + right + ')' : '无'}`;
    hintEl.style.color = "#f39c12";
  }
  
  updatePseudocode([
    "heapifyDown(arr, i, n):",
    "  smallest = i",
    "  left = 2*i + 1",
    "  right = 2*i + 2",
    "  if left < n and arr[left] < arr[smallest]:",
    "    smallest = left",
    "  if right < n and arr[right] < arr[smallest]:",
    "    smallest = right",
    "  if smallest != i:",
    "    swap(arr[i], arr[smallest])",
    "    heapifyDown(arr, smallest, n)"
  ], 1);
  
  renderHeap([index, left, right].filter(i => i < size));
  await sleep(800);
  
  // 比较左子节点
  if (left < size && arr[left] < arr[smallest]) {
    smallest = left;
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  smallest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] < arr[smallest]:  ← 当前执行",
      "    smallest = left",
      "  if right < n and arr[right] < arr[smallest]:",
      "    smallest = right",
      "  if smallest != i:",
      "    swap(arr[i], arr[smallest])",
      "    heapifyDown(arr, smallest, n)"
    ], 4);
    renderHeap([index, left, right].filter(i => i < size));
    await sleep(600);
  }
  
  // 比较右子节点
  if (right < size && arr[right] < arr[smallest]) {
    smallest = right;
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  smallest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] < arr[smallest]:",
      "    smallest = left",
      "  if right < n and arr[right] < arr[smallest]:  ← 当前执行",
      "    smallest = right",
      "  if smallest != i:",
      "    swap(arr[i], arr[smallest])",
      "    heapifyDown(arr, smallest, n)"
    ], 6);
    renderHeap([index, left, right].filter(i => i < size));
    await sleep(600);
  }
  
  // 如果需要交换
  if (smallest !== index) {
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  smallest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] < arr[smallest]:",
      "    smallest = left",
      "  if right < n and arr[right] < arr[smallest]:",
      "    smallest = right",
      "  if smallest != i:  ← 当前执行",
      "    swap(arr[i], arr[smallest])",
      "    heapifyDown(arr, smallest, n)"
    ], 8);
    
    if (hintEl) {
      hintEl.innerText = `交换 ${arr[index]} (索引${index}) 与 ${arr[smallest]} (索引${smallest})`;
      hintEl.style.color = "#e74c3c";
    }
    
    // 高亮交换的元素
    renderHeap([index, smallest], [index, smallest]);
    await sleep(600);
    
    // 执行交换
    [arr[index], arr[smallest]] = [arr[smallest], arr[index]];
    heapArray = [...arr];
    
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  smallest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] < arr[smallest]:",
      "    smallest = left",
      "  if right < n and arr[right] < arr[smallest]:",
      "    smallest = right",
      "  if smallest != i:",
      "    swap(arr[i], arr[smallest])  ← 当前执行",
      "    heapifyDown(arr, smallest, n)"
    ], 9);
    
    renderHeap([index, smallest], [index, smallest]);
    await sleep(800);
    
    // 递归调整
    updatePseudocode([
      "heapifyDown(arr, i, n):",
      "  smallest = i",
      "  left = 2*i + 1",
      "  right = 2*i + 2",
      "  if left < n and arr[left] < arr[smallest]:",
      "    smallest = left",
      "  if right < n and arr[right] < arr[smallest]:",
      "    smallest = right",
      "  if smallest != i:",
      "    swap(arr[i], arr[smallest])",
      "    heapifyDown(arr, smallest, n)  ← 当前执行（递归）"
    ], 10);
    
    await sleep(600);
    await heapifyDownMin(arr, size, smallest, hintEl);
  } else {
    if (hintEl) {
      hintEl.innerText = `节点 ${arr[index]} (索引${index}) 已满足堆性质`;
      hintEl.style.color = "#2ecc71";
    }
    renderHeap([index]);
    await sleep(600);
  }
}

// 建大根堆
async function buildMaxHeap() {
  if (isBuilding) return;
  isBuilding = true;
  
  const hintEl = document.getElementById("operation-hint");
  heapArray = [...DEFAULT_ARRAY];
  renderHeap();
  
  if (hintEl) {
    hintEl.innerText = "开始建大根堆：从最后一个非叶子节点开始，自底向上调整";
    hintEl.style.color = "#3498db";
  }
  
  updatePseudocode([
    "buildMaxHeap(arr):",
    "  n = arr.length",
    "  for i = (n/2 - 1) down to 0:",
    "    heapifyDown(arr, i, n)"
  ], -1);
  
  await sleep(1000);
  
  const n = heapArray.length;
  // 从最后一个非叶子节点开始
  const startIndex = Math.floor(n / 2) - 1;
  
  for (let i = startIndex; i >= 0; i--) {
    updatePseudocode([
      "buildMaxHeap(arr):",
      "  n = arr.length",
      "  for i = (n/2 - 1) down to 0:  ← 当前执行 i=" + i,
      "    heapifyDown(arr, i, n)"
    ], 2);
    
    if (hintEl) {
      hintEl.innerText = `调整节点 ${heapArray[i]} (索引${i})，使其满足大根堆性质（父节点 ≥ 子节点）`;
      hintEl.style.color = "#3498db";
    }
    
    await sleep(600);
    await heapifyDownMax(heapArray, n, i, hintEl);
  }
  
  updatePseudocode([
    "✓ 大根堆构建完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 大根堆构建完成！数组: [${heapArray.join(", ")}]`;
    hintEl.style.color = "#2ecc71";
  }
  
  renderHeap();
  logEvent("heap_build_max", heapArray.join(","));
  await sleep(2000);
  isBuilding = false;
}

// 建小根堆
async function buildMinHeap() {
  if (isBuilding) return;
  isBuilding = true;
  
  const hintEl = document.getElementById("operation-hint");
  heapArray = [...DEFAULT_ARRAY];
  renderHeap();
  
  if (hintEl) {
    hintEl.innerText = "开始建小根堆：从最后一个非叶子节点开始，自底向上调整";
    hintEl.style.color = "#3498db";
  }
  
  updatePseudocode([
    "buildMinHeap(arr):",
    "  n = arr.length",
    "  for i = (n/2 - 1) down to 0:",
    "    heapifyDown(arr, i, n)"
  ], -1);
  
  await sleep(1000);
  
  const n = heapArray.length;
  // 从最后一个非叶子节点开始
  const startIndex = Math.floor(n / 2) - 1;
  
  for (let i = startIndex; i >= 0; i--) {
    updatePseudocode([
      "buildMinHeap(arr):",
      "  n = arr.length",
      "  for i = (n/2 - 1) down to 0:  ← 当前执行 i=" + i,
      "    heapifyDown(arr, i, n)"
    ], 2);
    
    if (hintEl) {
      hintEl.innerText = `调整节点 ${heapArray[i]} (索引${i})，使其满足小根堆性质（父节点 ≤ 子节点）`;
      hintEl.style.color = "#3498db";
    }
    
    await sleep(600);
    await heapifyDownMin(heapArray, n, i, hintEl);
  }
  
  updatePseudocode([
    "✓ 小根堆构建完成！"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 小根堆构建完成！数组: [${heapArray.join(", ")}]`;
    hintEl.style.color = "#2ecc71";
  }
  
  renderHeap();
  logEvent("heap_build_min", heapArray.join(","));
  await sleep(2000);
  isBuilding = false;
}

function resetHeap() {
  if (isBuilding) return;
  heapArray = [...DEFAULT_ARRAY];
  renderHeap();
  const hintEl = document.getElementById("operation-hint");
  if (hintEl) {
    hintEl.innerText = "已重置为初始数组";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("heap_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 建堆的时间复杂度是 O(n)
  if (ans === "O(n)") {
    out.innerText = "✔ 正确！建堆操作的时间复杂度是 O(n)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("heap");
  } else {
    out.innerText = "✖ 错误。建堆操作的时间复杂度是 O(n)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_heap");
  const ans = await aiCall("/hint", "建堆操作的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_heap");
  const ans = await aiCall("/explain", "请解释堆的构建过程，以及大根堆和小根堆的区别");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initHeap() {
  initCommonUI();
  renderHeap();
  updatePseudocode(["// 等待操作..."], -1);

  const maxHeapBtn = document.getElementById("max-heap-btn");
  const minHeapBtn = document.getElementById("min-heap-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (maxHeapBtn) maxHeapBtn.addEventListener("click", () => { 
    buildMaxHeap(); 
    logEvent("heap_build_max_click"); 
  });
  
  if (minHeapBtn) minHeapBtn.addEventListener("click", () => { 
    buildMinHeap(); 
    logEvent("heap_build_min_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetHeap);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("heap"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initHeap);
