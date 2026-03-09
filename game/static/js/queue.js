// 队列页面专用逻辑

// 队列类
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toArray() {
    return [...this.items];
  }
}

const DEFAULT_VALUES = [5, 10, 15];
let queue = new Queue();
DEFAULT_VALUES.forEach(v => queue.enqueue(v));

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 更新伪代码显示
function updatePseudocode(lines, highlightIndex = -1) {
  const codeContainer = document.getElementById("pseudocode");
  if (!codeContainer) return;
  
  codeContainer.innerHTML = lines.map((line, index) => 
    `<div id="code-line-${index}" class="code-line" ${highlightIndex === index ? 'style="background:#fff3cd; padding:4px; border-left:3px solid #ffc107;"' : ''}>${line}</div>`
  ).join("");
}

// 渲染队列
function renderQueue() {
  const container = document.getElementById("queue-elements");
  const frontPointer = document.getElementById("front-pointer-wrapper");
  const rearPointer = document.getElementById("rear-pointer-wrapper");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (queue.isEmpty()) {
    // 空队列
    const emptyMsg = document.createElement("div");
    emptyMsg.style.cssText = "padding:20px; color:var(--muted); font-size:14px; text-align:center; width:100%;";
    emptyMsg.innerText = "Empty Queue (front = null, rear = null)";
    container.appendChild(emptyMsg);
    
    if (frontPointer) frontPointer.style.display = "none";
    if (rearPointer) rearPointer.style.display = "none";
    return;
  }
  
  // 显示指针
  if (frontPointer) frontPointer.style.display = "flex";
  if (rearPointer) rearPointer.style.display = "flex";
  
  // 从左到右渲染元素
  const items = queue.toArray();
  items.forEach((value, index) => {
    const element = document.createElement("div");
    element.className = "queue-element";
    element.dataset.index = index;
    element.dataset.value = value;
    element.style.cssText = `
      width: 80px;
      height: 80px;
      background: #4a90e2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      border-radius: 8px;
      border: 2px solid #3498db;
      transition: all 0.4s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      flex-shrink: 0;
    `;
    element.innerText = value;
    
    // 队头元素特殊标记
    if (index === 0) {
      element.style.borderColor = "#e74c3c";
      element.style.borderWidth = "3px";
    }
    
    // 队尾元素特殊标记
    if (index === items.length - 1) {
      element.style.borderColor = "#2ecc71";
      element.style.borderWidth = "3px";
    }
    
    container.appendChild(element);
  });
  
  // 更新指针位置
  updatePointers();
}

// 更新 front 和 rear 指针位置
function updatePointers() {
  const frontPointer = document.getElementById("front-pointer-wrapper");
  const rearPointer = document.getElementById("rear-pointer-wrapper");
  const container = document.getElementById("queue-elements");
  if (!frontPointer || !rearPointer || !container) return;
  
  if (queue.isEmpty()) {
    frontPointer.style.display = "none";
    rearPointer.style.display = "none";
    return;
  }
  
  const elements = container.querySelectorAll(".queue-element");
  if (elements.length === 0) return;
  
  // 显示指针
  frontPointer.style.display = "flex";
  rearPointer.style.display = "flex";
  
  // 获取队头元素位置
  const frontElement = elements[0];
  const rearElement = elements[elements.length - 1];
  
  if (frontElement && rearElement) {
    const containerRect = container.getBoundingClientRect();
    const frontRect = frontElement.getBoundingClientRect();
    const rearRect = rearElement.getBoundingClientRect();
    
    // front 指针位于队头元素上方
    const frontLeft = frontRect.left - containerRect.left + frontRect.width / 2 - 8;
    frontPointer.style.left = `${frontLeft}px`;
    
    // rear 指针位于队尾元素上方
    const rearLeft = rearRect.left - containerRect.left + rearRect.width / 2 - 8;
    const containerWidth = containerRect.width;
    rearPointer.style.right = `${containerWidth - rearLeft - 16}px`;
  }
}

// Enqueue 操作
async function enqueueElement() {
  const hintEl = document.getElementById("operation-hint");
  const enqueueValues = [5, 10, 15, 20, 25, 30];
  const newValue = enqueueValues[queue.size() % enqueueValues.length];
  
  if (hintEl) {
    hintEl.innerText = `正在执行 Enqueue：元素 ${newValue} 入队`;
    hintEl.style.color = "#2ecc71";
  }
  
  const wasEmpty = queue.isEmpty();
  
  // 显示伪代码
  if (wasEmpty) {
    updatePseudocode([
      "1. queue[rear] = element",
      "2. front = rear = 0",
      "3. rear = rear + 1"
    ], -1);
  } else {
    updatePseudocode([
      "1. queue[rear] = element",
      "2. rear = rear + 1"
    ], -1);
  }
  
  await sleep(800);
  
  const container = document.getElementById("queue-elements");
  if (!container) return;
  
  // 步骤1：新元素从队尾方向进入
  if (wasEmpty) {
    updatePseudocode([
      "1. queue[rear] = element  ← 当前执行",
      "2. front = rear = 0",
      "3. rear = rear + 1"
    ], 0);
  } else {
    updatePseudocode([
      "1. queue[rear] = element  ← 当前执行",
      "2. rear = rear + 1"
    ], 0);
  }
  
  // 创建新元素（在队尾右侧）
  const newElement = document.createElement("div");
  newElement.className = "queue-element";
  newElement.dataset.value = newValue;
  newElement.style.cssText = `
    width: 80px;
    height: 80px;
    background: #2ecc71;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
    border-radius: 8px;
    border: 3px solid #2ecc71;
    position: absolute;
    right: -100px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.6s ease;
    box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
    z-index: 5;
    flex-shrink: 0;
  `;
  newElement.innerText = newValue;
  
  container.style.position = "relative";
  container.appendChild(newElement);
  
  await sleep(500);
  
  // 新元素向左移动到队尾
  newElement.style.right = "60px";
  newElement.style.position = "relative";
  newElement.style.transform = "translateY(-50%) scale(1.1)";
  
  await sleep(600);
  
  // 执行 Enqueue
  queue.enqueue(newValue);
  
  // 重新渲染（新元素会出现在正确位置）
  renderQueue();
  
  // 高亮新元素
  await sleep(200);
  const allElements = container.querySelectorAll(".queue-element");
  if (allElements.length > 0) {
    const rearElement = allElements[allElements.length - 1];
    rearElement.style.transition = "all 0.3s ease";
    rearElement.style.transform = "scale(1.15)";
    rearElement.style.boxShadow = "0 0 20px #2ecc71";
    await sleep(500);
    rearElement.style.transform = "scale(1)";
    rearElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  }
  
  // 步骤2/3：更新指针
  if (wasEmpty) {
    updatePseudocode([
      "1. queue[rear] = element",
      "2. front = rear = 0  ← 当前执行",
      "3. rear = rear + 1"
    ], 1);
    await sleep(600);
    updatePseudocode([
      "1. queue[rear] = element",
      "2. front = rear = 0",
      "3. rear = rear + 1  ← 当前执行"
    ], 2);
  } else {
    updatePseudocode([
      "1. queue[rear] = element",
      "2. rear = rear + 1  ← 当前执行"
    ], 1);
  }
  
  // 更新指针位置（延迟确保DOM已更新）
  setTimeout(() => updatePointers(), 200);
  await sleep(500);
  
  updatePseudocode([
    "✓ Enqueue 完成！元素已入队"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ Enqueue 完成！队列: [${queue.toArray().join(", ")}]`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("queue_enqueue", `value=${newValue}`);
  await sleep(1500);
  if (hintEl) hintEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
}

// Dequeue 操作
async function dequeueElement() {
  const hintEl = document.getElementById("operation-hint");
  
  if (queue.isEmpty()) {
    if (hintEl) {
      hintEl.innerText = "队列为空，无法出队";
      hintEl.style.color = "#e74c3c";
    }
    updatePseudocode([
      "if (queue.isEmpty()) {",
      "  return ERROR;  ← 当前执行",
      "}"
    ], 1);
    await sleep(2000);
    if (hintEl) hintEl.innerText = "";
    updatePseudocode(["// 等待操作..."], -1);
    return;
  }
  
  const dequeuedValue = queue.front();
  const willBeEmpty = queue.size() === 1;
  
  if (hintEl) {
    hintEl.innerText = `正在执行 Dequeue：元素 ${dequeuedValue} 出队`;
    hintEl.style.color = "#e74c3c";
  }
  
  // 显示伪代码
  if (willBeEmpty) {
    updatePseudocode([
      "1. element = queue[front]",
      "2. front = rear = null",
      "3. return element"
    ], -1);
  } else {
    updatePseudocode([
      "1. element = queue[front]",
      "2. front = front + 1",
      "3. return element"
    ], -1);
  }
  
  await sleep(800);
  
  const container = document.getElementById("queue-elements");
  if (!container) return;
  
  const elements = container.querySelectorAll(".queue-element");
  if (elements.length === 0) return;
  
  const frontElement = elements[0];
  
  // 步骤1：获取队头元素
  if (willBeEmpty) {
    updatePseudocode([
      "1. element = queue[front]  ← 当前执行",
      "2. front = rear = null",
      "3. return element"
    ], 0);
  } else {
    updatePseudocode([
      "1. element = queue[front]  ← 当前执行",
      "2. front = front + 1",
      "3. return element"
    ], 0);
  }
  
  // 高亮队头元素
  frontElement.style.transition = "all 0.4s ease";
  frontElement.style.background = "#e74c3c";
  frontElement.style.borderColor = "#e74c3c";
  frontElement.style.transform = "scale(1.1)";
  frontElement.style.boxShadow = "0 0 20px #e74c3c";
  
  await sleep(600);
  
  // 步骤2：更新 front
  if (willBeEmpty) {
    updatePseudocode([
      "1. element = queue[front]",
      "2. front = rear = null  ← 当前执行",
      "3. return element"
    ], 1);
  } else {
    updatePseudocode([
      "1. element = queue[front]",
      "2. front = front + 1  ← 当前执行",
      "3. return element"
    ], 1);
  }
  
  // 元素向左移出
  frontElement.style.transition = "all 0.6s ease";
  frontElement.style.transform = "translateX(-150px) scale(0.8)";
  frontElement.style.opacity = "0";
  
  await sleep(600);
  
  // 执行 Dequeue
  queue.dequeue();
  
  // 重新渲染
  renderQueue();
  
  // 更新指针位置（延迟确保DOM已更新）
  setTimeout(() => updatePointers(), 200);
  
  // 步骤3：返回元素
  if (willBeEmpty) {
    updatePseudocode([
      "1. element = queue[front]",
      "2. front = rear = null",
      "3. return element  ← 当前执行"
    ], 2);
  } else {
    updatePseudocode([
      "1. element = queue[front]",
      "2. front = front + 1",
      "3. return element  ← 当前执行"
    ], 2);
  }
  
  await sleep(500);
  
  updatePseudocode([
    `✓ Dequeue 完成！返回元素 ${dequeuedValue}`
  ], -1);
  
  if (hintEl) {
    if (queue.isEmpty()) {
      hintEl.innerText = `✓ Dequeue 完成！弹出元素 ${dequeuedValue}，队列已为空`;
    } else {
      hintEl.innerText = `✓ Dequeue 完成！弹出元素 ${dequeuedValue}，队列: [${queue.toArray().join(", ")}]`;
    }
    hintEl.style.color = "#e74c3c";
  }
  
  logEvent("queue_dequeue", `value=${dequeuedValue}`);
  await sleep(1500);
  if (hintEl) hintEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
}

function resetQueue() {
  queue = new Queue();
  DEFAULT_VALUES.forEach(v => queue.enqueue(v));
  renderQueue();
  setTimeout(() => updatePointers(), 100);
  const hintEl = document.getElementById("operation-hint");
  if (hintEl) {
    hintEl.innerText = "已重置为初始队列";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("queue_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 队列的 Enqueue 和 Dequeue 操作的时间复杂度是 O(1)（如果使用循环队列）或 O(n)（如果使用数组实现）
  // 这里我们使用数组实现，但通常说队列操作是 O(1)，因为实际应用中会使用循环队列
  // 为了教学，我们说是 O(1)
  if (ans === "O(1)") {
    out.innerText = "✔ 正确！队列的 Enqueue 和 Dequeue 操作的时间复杂度是 O(1)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("queue");
  } else {
    out.innerText = "✖ 错误。队列的 Enqueue 和 Dequeue 操作的时间复杂度是 O(1)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_queue");
  const ans = await aiCall("/hint", "队列的 Enqueue 和 Dequeue 操作的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_queue");
  const ans = await aiCall("/explain", "请解释队列的 FIFO 特性，以及 Enqueue 和 Dequeue 操作的实现原理");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initQueue() {
  initCommonUI();
  renderQueue();
  setTimeout(() => updatePointers(), 100);
  updatePseudocode(["// 等待操作..."], -1);
  
  // 窗口大小改变时更新指针位置
  window.addEventListener('resize', () => {
    setTimeout(() => updatePointers(), 100);
  });

  const enqueueBtn = document.getElementById("enqueue-btn");
  const dequeueBtn = document.getElementById("dequeue-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (enqueueBtn) enqueueBtn.addEventListener("click", () => { 
    enqueueElement(); 
    logEvent("queue_enqueue_click"); 
  });
  
  if (dequeueBtn) dequeueBtn.addEventListener("click", () => { 
    dequeueElement(); 
    logEvent("queue_dequeue_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetQueue);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("queue"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initQueue);
