// 栈页面专用逻辑

// 栈类
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  peek() {
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

const DEFAULT_VALUES = [10, 20, 30];
let stack = new Stack();
DEFAULT_VALUES.forEach(v => stack.push(v));

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 更新伪代码显示
function updatePseudocode(lines, highlightIndex = -1) {
  const codeContainer = document.getElementById("pseudocode");
  if (!codeContainer) return;
  
  codeContainer.innerHTML = lines.map((line, index) => 
    `<div id="code-line-${index}" class="code-line" ${highlightIndex === index ? 'style="background:#fff3cd; padding:4px; border-left:3px solid #ffc107;"' : ''}>${line}</div>`
  ).join("");
}

// 渲染栈
function renderStack() {
  const container = document.getElementById("stack-elements");
  const topPointer = document.getElementById("top-pointer");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (stack.isEmpty()) {
    // 空栈
    const emptyMsg = document.createElement("div");
    emptyMsg.style.cssText = "padding:20px; color:var(--muted); font-size:14px; text-align:center;";
    emptyMsg.innerText = "Empty Stack";
    container.appendChild(emptyMsg);
    
    if (topPointer) {
      topPointer.style.display = "none";
    }
    return;
  }
  
  // 显示 top 指针
  if (topPointer) {
    topPointer.style.display = "flex";
  }
  
  // 从底部到顶部渲染元素（数组从下往上显示）
  const items = stack.toArray();
  items.forEach((value, index) => {
    const element = document.createElement("div");
    element.className = "stack-element";
    element.dataset.index = index;
    element.dataset.value = value;
    element.style.cssText = `
      width: 100px;
      height: 50px;
      background: #4a90e2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      border-radius: 6px;
      border: 2px solid #3498db;
      transition: all 0.4s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    element.innerText = value;
    
    // 栈顶元素特殊标记
    if (index === items.length - 1) {
      element.style.borderColor = "#2ecc71";
      element.style.borderWidth = "3px";
    }
    
    container.appendChild(element);
  });
  
  // 更新 top 指针位置
  updateTopPointer();
}

// 更新 top 指针位置
function updateTopPointer() {
  const topPointer = document.getElementById("top-pointer-wrapper");
  const container = document.getElementById("stack-elements");
  if (!topPointer || !container) return;
  
  if (stack.isEmpty()) {
    topPointer.style.display = "none";
    return;
  }
  
  const elements = container.querySelectorAll(".stack-element");
  if (elements.length === 0) {
    topPointer.style.display = "none";
    return;
  }
  
  // 显示 top 指针
  topPointer.style.display = "flex";
  
  // 计算 top 指针位置：位于栈顶元素上方
  // 由于使用 flex-direction: column-reverse，最后一个元素在视觉上是最上面的
  const elementHeight = 50; // 元素高度
  const elementGap = 4; // 元素间距
  const stackHeight = elements.length * (elementHeight + elementGap);
  
  // top 指针位于栈顶上方 20px
  // 容器底部到栈顶的距离 = 容器高度 - stackHeight - 底部标记高度
  const stackContainer = document.getElementById("stack-container");
  if (stackContainer) {
    const containerHeight = stackContainer.offsetHeight;
    const bottomHeight = 30; // 底部标记高度
    const topPosition = containerHeight - stackHeight - bottomHeight - 20; // 栈顶上方 20px
    
    topPointer.style.top = `${Math.max(0, topPosition)}px`;
  }
}

// Push 操作
async function pushElement() {
  const hintEl = document.getElementById("operation-hint");
  const pushValues = [10, 20, 30, 40, 50];
  const newValue = pushValues[stack.size() % pushValues.length];
  
  if (hintEl) {
    hintEl.innerText = `正在执行 Push：元素 ${newValue} 入栈`;
    hintEl.style.color = "#2ecc71";
  }
  
  // 显示伪代码
  updatePseudocode([
    "1. stack[top] = element",
    "2. top = top + 1"
  ], -1);
  
  await sleep(800);
  
  // 步骤1：新元素从上方进入
  updatePseudocode([
    "1. stack[top] = element  ← 当前执行",
    "2. top = top + 1"
  ], 0);
  
  const container = document.getElementById("stack-elements");
  if (!container) return;
  
  // 创建新元素（在栈顶上方）
  const newElement = document.createElement("div");
  newElement.className = "stack-element";
  newElement.dataset.value = newValue;
  newElement.style.cssText = `
    width: 100px;
    height: 50px;
    background: #2ecc71;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
    border-radius: 6px;
    border: 3px solid #2ecc71;
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.6s ease;
    box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
    z-index: 5;
  `;
  newElement.innerText = newValue;
  
  container.style.position = "relative";
  container.appendChild(newElement);
  
  await sleep(500);
  
  // 新元素向下移动到栈顶
  const currentTop = stack.size();
  const targetTop = currentTop * 54; // 每个元素高度50px + 间距4px
  
  newElement.style.top = `${-targetTop}px`;
  newElement.style.position = "relative";
  newElement.style.transform = "translateX(-50%) scale(1.1)";
  
  await sleep(600);
  
  // 执行 Push
  stack.push(newValue);
  
  // 重新渲染（新元素会出现在正确位置）
  renderStack();
  
  // 高亮新元素
  await sleep(200);
  const allElements = container.querySelectorAll(".stack-element");
  if (allElements.length > 0) {
    const topElement = allElements[allElements.length - 1];
    topElement.style.transition = "all 0.3s ease";
    topElement.style.transform = "scale(1.15)";
    topElement.style.boxShadow = "0 0 20px #2ecc71";
    await sleep(500);
    topElement.style.transform = "scale(1)";
    topElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  }
  
  // 步骤2：更新 top
  updatePseudocode([
    "1. stack[top] = element",
    "2. top = top + 1  ← 当前执行"
  ], 1);
  
  // 更新 top 指针位置（延迟确保DOM已更新）
  setTimeout(() => updateTopPointer(), 100);
  await sleep(600);
  
  updatePseudocode([
    "✓ Push 完成！元素已入栈"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ Push 完成！栈: [${stack.toArray().join(", ")}]`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("stack_push", `value=${newValue}`);
  await sleep(1500);
  if (hintEl) hintEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
}

// Pop 操作
async function popElement() {
  const hintEl = document.getElementById("operation-hint");
  
  if (stack.isEmpty()) {
    if (hintEl) {
      hintEl.innerText = "栈为空，无法出栈";
      hintEl.style.color = "#e74c3c";
    }
    updatePseudocode([
      "if (stack.isEmpty()) {",
      "  return ERROR;  ← 当前执行",
      "}"
    ], 1);
    await sleep(2000);
    if (hintEl) hintEl.innerText = "";
    updatePseudocode(["// 等待操作..."], -1);
    return;
  }
  
  const poppedValue = stack.peek();
  
  if (hintEl) {
    hintEl.innerText = `正在执行 Pop：弹出栈顶元素 ${poppedValue}`;
    hintEl.style.color = "#e74c3c";
  }
  
  // 显示伪代码
  updatePseudocode([
    "1. element = stack[top]",
    "2. top = top - 1",
    "3. return element"
  ], -1);
  
  await sleep(800);
  
  // 步骤1：获取栈顶元素
  updatePseudocode([
    "1. element = stack[top]  ← 当前执行",
    "2. top = top - 1",
    "3. return element"
  ], 0);
  
  const container = document.getElementById("stack-elements");
  if (!container) return;
  
  const elements = container.querySelectorAll(".stack-element");
  if (elements.length === 0) return;
  
  const topElement = elements[elements.length - 1];
  
  // 高亮栈顶元素
  topElement.style.transition = "all 0.4s ease";
  topElement.style.background = "#e74c3c";
  topElement.style.borderColor = "#e74c3c";
  topElement.style.transform = "scale(1.1)";
  topElement.style.boxShadow = "0 0 20px #e74c3c";
  
  await sleep(600);
  
  // 步骤2：更新 top
  updatePseudocode([
    "1. element = stack[top]",
    "2. top = top - 1  ← 当前执行",
    "3. return element"
  ], 1);
  
  // 元素向上移出
  topElement.style.transition = "all 0.6s ease";
  topElement.style.transform = "translateY(-100px) scale(0.8)";
  topElement.style.opacity = "0";
  
  await sleep(600);
  
  // 执行 Pop
  stack.pop();
  
  // 重新渲染
  renderStack();
  
  // 更新 top 指针位置
  setTimeout(() => updateTopPointer(), 100);
  
  // 步骤3：返回元素
  updatePseudocode([
    "1. element = stack[top]",
    "2. top = top - 1",
    "3. return element  ← 当前执行"
  ], 2);
  
  await sleep(500);
  
  updatePseudocode([
    `✓ Pop 完成！返回元素 ${poppedValue}`
  ], -1);
  
  if (hintEl) {
    if (stack.isEmpty()) {
      hintEl.innerText = `✓ Pop 完成！弹出元素 ${poppedValue}，栈已为空`;
    } else {
      hintEl.innerText = `✓ Pop 完成！弹出元素 ${poppedValue}，栈: [${stack.toArray().join(", ")}]`;
    }
    hintEl.style.color = "#e74c3c";
  }
  
  logEvent("stack_pop", `value=${poppedValue}`);
  await sleep(1500);
  if (hintEl) hintEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
}

function resetStack() {
  stack = new Stack();
  DEFAULT_VALUES.forEach(v => stack.push(v));
  renderStack();
  const hintEl = document.getElementById("operation-hint");
  if (hintEl) {
    hintEl.innerText = "已重置为初始栈";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("stack_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 栈的 Push 和 Pop 操作的时间复杂度是 O(1)
  if (ans === "O(1)") {
    out.innerText = "✔ 正确！栈的 Push 和 Pop 操作的时间复杂度是 O(1)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("stack");
  } else {
    out.innerText = "✖ 错误。栈的 Push 和 Pop 操作的时间复杂度是 O(1)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_stack");
  const ans = await aiCall("/hint", "栈的 Push 和 Pop 操作的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_stack");
  const ans = await aiCall("/explain", "请解释栈的 LIFO 特性，以及 Push 和 Pop 操作的实现原理");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initStack() {
  initCommonUI();
  renderStack();
  setTimeout(() => updateTopPointer(), 100);
  updatePseudocode(["// 等待操作..."], -1);
  
  // 窗口大小改变时更新 top 指针位置
  window.addEventListener('resize', () => {
    setTimeout(() => updateTopPointer(), 100);
  });

  const pushBtn = document.getElementById("push-btn");
  const popBtn = document.getElementById("pop-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (pushBtn) pushBtn.addEventListener("click", () => { 
    pushElement(); 
    logEvent("stack_push_click"); 
  });
  
  if (popBtn) popBtn.addEventListener("click", () => { 
    popElement(); 
    logEvent("stack_pop_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetStack);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("stack"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initStack);
