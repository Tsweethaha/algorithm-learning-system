// 单链表页面专用逻辑

// 单链表节点类
class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// 单链表类
class LinkedList {
  constructor() {
    this.head = null;
  }

  // 将数组转换为链表
  fromArray(arr) {
    if (arr.length === 0) {
      this.head = null;
      return;
    }
    this.head = new ListNode(arr[0]);
    let current = this.head;
    for (let i = 1; i < arr.length; i++) {
      current.next = new ListNode(arr[i]);
      current = current.next;
    }
  }

  // 转换为数组（用于调试）
  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  // 获取第n个节点（从0开始）
  getNodeAt(index) {
    let current = this.head;
    for (let i = 0; i < index && current; i++) {
      current = current.next;
    }
    return current;
  }

  // 获取链表长度
  length() {
    let count = 0;
    let current = this.head;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }
}

const DEFAULT_VALUES = [10, 20, 30, 40];
let linkedList = new LinkedList();
linkedList.fromArray(DEFAULT_VALUES);
let insertMode = 'middle'; // 'middle' 或 'end'
let deleteMode = 'middle'; // 'middle' 或 'end'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 更新伪代码显示
function updatePseudocode(lines, highlightIndex = -1) {
  const codeContainer = document.getElementById("pseudocode");
  if (!codeContainer) return;
  
  codeContainer.innerHTML = lines.map((line, index) => 
    `<div id="code-line-${index}" class="code-line" ${highlightIndex === index ? 'style="background:#fff3cd; padding:4px; border-left:3px solid #ffc107;"' : ''}>${line}</div>`
  ).join("");
}

// 渲染单链表
function renderLinkedList() {
  const container = document.getElementById("linkedlist-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  // 绘制 head 指针
  const headDiv = document.createElement("div");
  headDiv.className = "linkedlist-head";
  headDiv.style.cssText = "display:flex; flex-direction:column; align-items:center; margin-right:20px;";
  
  const headLabel = document.createElement("div");
  headLabel.innerText = "head";
  headLabel.style.cssText = "font-size:14px; color:var(--muted); font-weight:600; margin-bottom:8px;";
  
  const headPointer = document.createElement("div");
  headPointer.id = "head-pointer";
  headPointer.style.cssText = "width:40px; height:40px; border:2px solid #3498db; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#e3f2fd; font-size:12px; color:#3498db; font-weight:600;";
  headPointer.innerText = "→";
  
  headDiv.appendChild(headLabel);
  headDiv.appendChild(headPointer);
  container.appendChild(headDiv);
  
  // 绘制箭头从 head 指向第一个节点
  if (linkedList.head) {
    const arrow = document.createElement("div");
    arrow.className = "linkedlist-arrow";
    arrow.style.cssText = "width:30px; height:2px; background:#3498db; position:relative; margin-right:8px;";
    arrow.innerHTML = '<div style="position:absolute; right:-6px; top:-4px; width:0; height:0; border-left:8px solid #3498db; border-top:4px solid transparent; border-bottom:4px solid transparent;"></div>';
    container.appendChild(arrow);
  }
  
  // 绘制所有节点
  let current = linkedList.head;
  let index = 0;
  
  while (current) {
    const nodeWrapper = document.createElement("div");
    nodeWrapper.className = "linkedlist-node-wrapper";
    nodeWrapper.dataset.index = index;
    nodeWrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; position:relative;";
    
    const node = document.createElement("div");
    node.className = "linkedlist-node";
    node.dataset.index = index;
    node.dataset.value = current.data;
    node.style.cssText = "display:flex; border:2px solid #4a90e2; border-radius:6px; overflow:hidden; background:white; min-width:120px;";
    
    // data 部分
    const dataPart = document.createElement("div");
    dataPart.className = "node-data";
    dataPart.style.cssText = "padding:12px 16px; background:#4a90e2; color:white; font-weight:600; font-size:16px; border-right:2px solid #4a90e2;";
    dataPart.innerText = current.data;
    
    // next 指针部分
    const nextPart = document.createElement("div");
    nextPart.className = "node-next";
    nextPart.style.cssText = "padding:12px 16px; background:white; color:#4a90e2; font-weight:600; font-size:14px; min-width:50px; text-align:center;";
    if (current.next) {
      nextPart.innerText = "→";
    } else {
      nextPart.innerText = "null";
      nextPart.style.color = "#999";
    }
    
    node.appendChild(dataPart);
    node.appendChild(nextPart);
    nodeWrapper.appendChild(node);
    
    // 节点索引标签
    const indexLabel = document.createElement("div");
    indexLabel.style.cssText = "margin-top:6px; font-size:12px; color:var(--muted);";
    indexLabel.innerText = `节点 ${index}`;
    nodeWrapper.appendChild(indexLabel);
    
    container.appendChild(nodeWrapper);
    
    // 如果不是最后一个节点，绘制箭头
    if (current.next) {
      const arrow = document.createElement("div");
      arrow.className = "linkedlist-arrow";
      arrow.style.cssText = "width:30px; height:2px; background:#4a90e2; position:relative; margin:0 8px;";
      arrow.innerHTML = '<div style="position:absolute; right:-6px; top:-4px; width:0; height:0; border-left:8px solid #4a90e2; border-top:4px solid transparent; border-bottom:4px solid transparent;"></div>';
      container.appendChild(arrow);
    }
    
    current = current.next;
    index++;
  }
  
  // 如果链表为空，显示提示
  if (!linkedList.head) {
    const emptyMsg = document.createElement("div");
    emptyMsg.style.cssText = "color:var(--muted); font-size:14px; padding:20px;";
    emptyMsg.innerText = "链表为空";
    container.appendChild(emptyMsg);
  }
}

// 高亮节点
function highlightNode(index, color = "#f39c12") {
  const node = document.querySelector(`.linkedlist-node[data-index="${index}"]`);
  if (node) {
    node.style.transition = "all 0.3s ease";
    node.style.boxShadow = `0 0 15px ${color}`;
    node.style.transform = "scale(1.05)";
  }
}

// 取消高亮
function unhighlightNode(index) {
  const node = document.querySelector(`.linkedlist-node[data-index="${index}"]`);
  if (node) {
    node.style.transition = "all 0.3s ease";
    node.style.boxShadow = "";
    node.style.transform = "";
  }
}

// 高亮指针部分
function highlightNext(index, color = "#2ecc71") {
  const node = document.querySelector(`.linkedlist-node[data-index="${index}"]`);
  if (node) {
    const nextPart = node.querySelector(".node-next");
    if (nextPart) {
      nextPart.style.transition = "all 0.3s ease";
      nextPart.style.background = color;
      nextPart.style.color = "white";
    }
  }
}

// 取消指针高亮
function unhighlightNext(index) {
  const node = document.querySelector(`.linkedlist-node[data-index="${index}"]`);
  if (node) {
    const nextPart = node.querySelector(".node-next");
    if (nextPart) {
      nextPart.style.transition = "all 0.3s ease";
      nextPart.style.background = "white";
      nextPart.style.color = nextPart.innerText === "null" ? "#999" : "#4a90e2";
    }
  }
}

// 插入节点
async function insertNode() {
  const hintEl = document.getElementById("operation-hint");
  const len = linkedList.length();
  
  if (len === 0) {
    // 空链表，直接插入
    const newValue = 99;
    linkedList.head = new ListNode(newValue);
    
    if (hintEl) {
      hintEl.innerText = `在空链表中插入节点，值为 ${newValue}`;
      hintEl.style.color = "#2ecc71";
    }
    
    updatePseudocode([
      "1. newNode = new ListNode(99)",
      "2. head = newNode",
      "3. newNode.next = null"
    ], 0);
    
    await sleep(800);
    renderLinkedList();
    await sleep(500);
    
    logEvent("linkedlist_insert", `value=${newValue}, empty`);
    if (hintEl) hintEl.innerText = "";
    return;
  }
  
  let insertAfterIndex;
  let insertAfterNode;
  
  if (insertMode === 'middle') {
    // 在中间位置插入（第 len/2 个节点后）
    insertAfterIndex = Math.floor(len / 2) - 1;
    if (insertAfterIndex < 0) insertAfterIndex = 0;
    insertAfterNode = linkedList.getNodeAt(insertAfterIndex);
    insertMode = 'end';
  } else {
    // 在末尾插入
    insertAfterIndex = len - 1;
    insertAfterNode = linkedList.getNodeAt(insertAfterIndex);
    insertMode = 'middle';
  }
  
  const newValue = 99;
  
  if (hintEl) {
    hintEl.innerText = `在第 ${insertAfterIndex + 1} 个节点后插入新节点，值为 ${newValue}`;
    hintEl.style.color = "#2ecc71";
  }
  
  // 显示伪代码
  updatePseudocode([
    "1. newNode = new ListNode(99)",
    "2. newNode.next = current.next",
    "3. current.next = newNode"
  ], -1);
  
  await sleep(800);
  
  // 步骤1：创建新节点
  updatePseudocode([
    "1. newNode = new ListNode(99)  ← 当前执行",
    "2. newNode.next = current.next",
    "3. current.next = newNode"
  ], 0);
  
  // 高亮要插入位置的前一个节点
  highlightNode(insertAfterIndex, "#f39c12");
  await sleep(800);
  
  // 步骤2：设置 newNode.next
  updatePseudocode([
    "1. newNode = new ListNode(99)",
    "2. newNode.next = current.next  ← 当前执行",
    "3. current.next = newNode"
  ], 1);
  
  // 高亮当前节点的 next 指针
  highlightNext(insertAfterIndex, "#2ecc71");
  await sleep(800);
  
  // 创建新节点（在DOM中）
  const newNode = new ListNode(newValue);
  newNode.next = insertAfterNode.next;
  
  // 步骤3：更新 current.next
  updatePseudocode([
    "1. newNode = new ListNode(99)",
    "2. newNode.next = current.next",
    "3. current.next = newNode  ← 当前执行"
  ], 2);
  
  // 高亮 next 指针的变化
  highlightNext(insertAfterIndex, "#e74c3c");
  await sleep(600);
  
  // 执行插入
  insertAfterNode.next = newNode;
  
  // 重新渲染（新节点会以动画出现）
  renderLinkedList();
  
  // 高亮新插入的节点（需要等待DOM更新）
  const newIndex = insertAfterIndex + 1;
  await sleep(100);
  
  const newNodeElement = document.querySelector(`.linkedlist-node[data-index="${newIndex}"]`);
  if (newNodeElement) {
    // 新节点出现动画
    newNodeElement.style.transition = "all 0.5s ease";
    newNodeElement.style.transform = "scale(0.8)";
    newNodeElement.style.opacity = "0";
    await sleep(50);
    newNodeElement.style.transform = "scale(1.1)";
    newNodeElement.style.opacity = "1";
    newNodeElement.style.boxShadow = "0 0 20px #2ecc71";
    
    // 高亮新节点的 data 部分
    const dataPart = newNodeElement.querySelector(".node-data");
    if (dataPart) {
      dataPart.style.transition = "all 0.3s ease";
      dataPart.style.background = "#2ecc71";
    }
    
    await sleep(500);
    
    // 恢复正常
    newNodeElement.style.transform = "scale(1)";
    newNodeElement.style.boxShadow = "";
    if (dataPart) {
      dataPart.style.background = "#4a90e2";
    }
    
    // 更新新节点的 next 显示
    const nextPart = newNodeElement.querySelector(".node-next");
    if (nextPart) {
      nextPart.style.transition = "all 0.3s ease";
      nextPart.style.background = "#2ecc71";
      nextPart.style.color = "white";
      await sleep(400);
      nextPart.style.background = "white";
      nextPart.style.color = newNode.next ? "#4a90e2" : "#999";
    }
  }
  
  await sleep(500);
  
  // 取消所有高亮
  unhighlightNode(insertAfterIndex);
  unhighlightNode(newIndex);
  unhighlightNext(insertAfterIndex);
  
  updatePseudocode([
    "✓ 插入完成！新节点已连接到链表中"
  ], -1);
  
  if (hintEl) {
    hintEl.innerText = `✓ 插入完成！数组: [${linkedList.toArray().join(", ")}]`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("linkedlist_insert", `after=${insertAfterIndex}, value=${newValue}`);
  await sleep(1500);
  if (hintEl) hintEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
}

// 删除节点
async function deleteNode() {
  const hintEl = document.getElementById("operation-hint");
  const len = linkedList.length();
  
  if (len === 0) {
    if (hintEl) {
      hintEl.innerText = "链表为空，无法删除";
      hintEl.style.color = "#e74c3c";
    }
    await sleep(1500);
    if (hintEl) hintEl.innerText = "";
    return;
  }
  
  if (len === 1) {
    // 只有一个节点
    const deletedValue = linkedList.head.data;
    if (hintEl) {
      hintEl.innerText = `正在删除节点：值为 ${deletedValue}`;
      hintEl.style.color = "#e74c3c";
    }
    
    updatePseudocode([
      "1. head = head.next",
      "2. 释放原节点内存"
    ], 0);
    
    await sleep(800);
    highlightNode(0, "#e74c3c");
    await sleep(600);
    
    linkedList.head = null;
    renderLinkedList();
    
    logEvent("linkedlist_delete", `value=${deletedValue}, single`);
    await sleep(1000);
    if (hintEl) hintEl.innerText = "";
    updatePseudocode(["// 等待操作..."], -1);
    return;
  }
  
  let deleteIndex;
  let prevNode;
  let deleteNode;
  
  if (deleteMode === 'middle') {
    // 删除中间节点
    deleteIndex = Math.floor(len / 2);
    prevNode = linkedList.getNodeAt(deleteIndex - 1);
    deleteNode = prevNode.next;
    deleteMode = 'end';
  } else {
    // 删除末尾节点
    deleteIndex = len - 1;
    prevNode = linkedList.getNodeAt(deleteIndex - 1);
    deleteNode = prevNode.next;
    deleteMode = 'middle';
  }
  
  const deletedValue = deleteNode.data;
  
  if (hintEl) {
    hintEl.innerText = `正在删除节点：值为 ${deletedValue}`;
    hintEl.style.color = "#e74c3c";
  }
  
  // 显示伪代码
  updatePseudocode([
    "1. prev = 找到要删除节点的前一个节点",
    "2. prev.next = current.next",
    "3. 释放 current 节点内存"
  ], -1);
  
  await sleep(800);
  
  // 步骤1：找到前一个节点
  updatePseudocode([
    "1. prev = 找到要删除节点的前一个节点  ← 当前执行",
    "2. prev.next = current.next",
    "3. 释放 current 节点内存"
  ], 0);
  
  // 高亮前一个节点
  highlightNode(deleteIndex - 1, "#f39c12");
  await sleep(600);
  
  // 高亮要删除的节点
  highlightNode(deleteIndex, "#e74c3c");
  await sleep(600);
  
  // 步骤2：更新 prev.next
  updatePseudocode([
    "1. prev = 找到要删除节点的前一个节点",
    "2. prev.next = current.next  ← 当前执行",
    "3. 释放 current 节点内存"
  ], 1);
  
  // 高亮前一个节点的 next 指针
  highlightNext(deleteIndex - 1, "#2ecc71");
  await sleep(600);
  
  // 高亮要删除节点的 next
  if (deleteNode.next) {
    highlightNext(deleteIndex, "#2ecc71");
  }
  await sleep(600);
  
  // 步骤3：执行删除
  updatePseudocode([
    "1. prev = 找到要删除节点的前一个节点",
    "2. prev.next = current.next",
    "3. 释放 current 节点内存  ← 当前执行"
  ], 2);
  
  // 被删除节点变灰并缩小
  const deleteNodeElement = document.querySelector(`.linkedlist-node[data-index="${deleteIndex}"]`);
  if (deleteNodeElement) {
    deleteNodeElement.style.transition = "all 0.6s ease";
    deleteNodeElement.style.opacity = "0.2";
    deleteNodeElement.style.filter = "grayscale(100%)";
    deleteNodeElement.style.transform = "scale(0.7)";
    
    // 节点内容变灰
    const dataPart = deleteNodeElement.querySelector(".node-data");
    const nextPart = deleteNodeElement.querySelector(".node-next");
    if (dataPart) {
      dataPart.style.background = "#999";
    }
    if (nextPart) {
      nextPart.style.background = "#ddd";
      nextPart.style.color = "#999";
    }
  }
  
  await sleep(800);
  
  // 更新指针
  prevNode.next = deleteNode.next;
  
  // 重新渲染（节点会从DOM中移除）
  renderLinkedList();
  
  await sleep(500);
  
  // 取消高亮
  unhighlightNode(deleteIndex - 1);
  unhighlightNext(deleteIndex - 1);
  
  updatePseudocode([
    "✓ 删除完成！节点已从链表中移除"
  ], -1);
  
  if (hintEl) {
    if (linkedList.length() > 0) {
      hintEl.innerText = `✓ 删除完成！数组: [${linkedList.toArray().join(", ")}]`;
    } else {
      hintEl.innerText = `✓ 删除完成！链表已为空`;
    }
    hintEl.style.color = "#e74c3c";
  }
  
  logEvent("linkedlist_delete", `index=${deleteIndex}, value=${deletedValue}`);
  await sleep(1500);
  if (hintEl) hintEl.innerText = "";
  updatePseudocode(["// 等待操作..."], -1);
}

function resetLinkedList() {
  linkedList = new LinkedList();
  linkedList.fromArray(DEFAULT_VALUES);
  insertMode = 'middle';
  deleteMode = 'middle';
  renderLinkedList();
  const hintEl = document.getElementById("operation-hint");
  if (hintEl) {
    hintEl.innerText = "已重置为初始链表";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  updatePseudocode(["// 等待操作..."], -1);
  logEvent("linkedlist_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 单链表在中间位置插入需要先找到插入位置，时间复杂度是 O(n)
  if (ans === "O(n)") {
    out.innerText = "✔ 正确！单链表在中间位置插入需要先遍历找到位置，时间复杂度是 O(n)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("linkedlist");
  } else {
    out.innerText = "✖ 错误。单链表在中间位置插入需要先遍历找到位置，时间复杂度是 O(n)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_linkedlist");
  const ans = await aiCall("/hint", "单链表在中间位置插入节点的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_linkedlist");
  const ans = await aiCall("/explain", "请解释单链表与数组在插入删除操作上的区别，为什么单链表不需要移动其他节点");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initLinkedList() {
  initCommonUI();
  renderLinkedList();
  updatePseudocode(["// 等待操作..."], -1);

  const insertBtn = document.getElementById("insert-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (insertBtn) insertBtn.addEventListener("click", () => { 
    insertNode(); 
    logEvent("linkedlist_insert_click"); 
  });
  
  if (deleteBtn) deleteBtn.addEventListener("click", () => { 
    deleteNode(); 
    logEvent("linkedlist_delete_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetLinkedList);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("linkedlist"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initLinkedList);
