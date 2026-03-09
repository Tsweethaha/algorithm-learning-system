// 数组页面专用逻辑
const DEFAULT_ARRAY = [3, 7, 12, 25, 40];
let currentArray = [...DEFAULT_ARRAY];
let deleteMode = 'middle'; // 'middle' 或 'end'，交替使用
let insertMode = 'middle'; // 'middle' 或 'end'，交替使用

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// 渲染数组，每个元素下方显示下标
function renderArray() {
  const container = document.getElementById("array-container");
  if (!container) return;
  
  container.innerHTML = currentArray.map((value, index) => `
    <div class="array-element-wrapper" data-index="${index}" style="display:flex; flex-direction:column; align-items:center;">
      <div class="bar array-element" data-value="${value}" data-index="${index}" style="transition: all 0.6s ease;">
        ${value}
      </div>
      <div class="array-index" style="margin-top:8px; font-size:14px; color:var(--muted); font-weight:600;">
        ${index}
      </div>
    </div>
  `).join("");
}

// 插入元素
async function insertElement() {
  const container = document.getElementById("array-container");
  const hintEl = document.getElementById("operation-hint");
  if (!container || currentArray.length === 0) return;
  
  // 确定插入位置和值
  let insertIndex;
  if (insertMode === 'middle') {
    // 中间位置：选择数组中间位置
    insertIndex = Math.floor(currentArray.length / 2);
    insertMode = 'end'; // 下次改为末尾
  } else {
    // 末尾位置
    insertIndex = currentArray.length;
    insertMode = 'middle'; // 下次改为中间
  }
  
  const newValue = 99; // 固定插入值 99
  
  // 显示提示
  if (hintEl) {
    hintEl.innerText = `正在插入：在下标 ${insertIndex} 处插入元素 ${newValue}`;
    hintEl.style.color = "#2ecc71";
  }
  await sleep(800);
  
  // 如果是中间插入，需要先移动后续元素
  if (insertIndex < currentArray.length) {
    // 获取所有元素包装器
    const wrappers = Array.from(container.children);
    
    // 先创建新元素（但暂时隐藏）
    const newWrapper = document.createElement("div");
    newWrapper.className = "array-element-wrapper";
    newWrapper.style.display = "flex";
    newWrapper.style.flexDirection = "column";
    newWrapper.style.alignItems = "center";
    newWrapper.style.opacity = "0";
    newWrapper.dataset.index = insertIndex;
    
    const newElement = document.createElement("div");
    newElement.className = "bar array-element";
    newElement.dataset.value = newValue;
    newElement.dataset.index = insertIndex;
    newElement.innerText = newValue;
    newElement.style.background = "#2ecc71";
    newElement.style.transform = "scale(0.8)";
    
    const newIndex = document.createElement("div");
    newIndex.className = "array-index";
    newIndex.style.marginTop = "8px";
    newIndex.style.fontSize = "14px";
    newIndex.style.color = "var(--muted)";
    newIndex.style.fontWeight = "600";
    newIndex.innerText = insertIndex;
    
    newWrapper.appendChild(newElement);
    newWrapper.appendChild(newIndex);
    
    // 插入到指定位置
    if (insertIndex < wrappers.length) {
      container.insertBefore(newWrapper, wrappers[insertIndex]);
    } else {
      container.appendChild(newWrapper);
    }
    
    // 移动后续元素：向右移动
    for (let i = insertIndex + 1; i < currentArray.length; i++) {
      const wrapper = wrappers[i];
      if (wrapper) {
        wrapper.style.transition = "transform 0.6s ease";
        wrapper.style.transform = "translateX(72px)"; // 向右移动一个元素宽度(60px)+间距(12px)
      }
    }
    
    await sleep(600);
    
    // 更新后续元素的下标显示
    for (let i = insertIndex + 1; i <= currentArray.length; i++) {
      const wrapper = container.children[i];
      if (wrapper) {
        const indexEl = wrapper.querySelector(".array-index");
        if (indexEl) indexEl.innerText = i;
        wrapper.dataset.index = i;
      }
    }
    
    // 新元素出现动画
    newWrapper.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    newWrapper.style.opacity = "1";
    newElement.style.transition = "all 0.4s ease";
    newElement.style.transform = "scale(1)";
    
    await sleep(500);
    
    // 恢复后续元素位置（因为DOM已经更新，需要重新获取）
    const allWrappers = Array.from(container.children);
    for (let i = insertIndex + 1; i < allWrappers.length; i++) {
      const wrapper = allWrappers[i];
      if (wrapper) {
        wrapper.style.transform = "translateX(0)";
      }
    }
    
    await sleep(600);
    
    // 新元素恢复正常颜色
    newElement.style.background = "";
    
  } else {
    // 末尾插入：直接添加
    const newWrapper = document.createElement("div");
    newWrapper.className = "array-element-wrapper";
    newWrapper.style.display = "flex";
    newWrapper.style.flexDirection = "column";
    newWrapper.style.alignItems = "center";
    newWrapper.style.opacity = "0";
    newWrapper.style.transform = "scale(0.8)";
    newWrapper.dataset.index = insertIndex;
    
    const newElement = document.createElement("div");
    newElement.className = "bar array-element";
    newElement.dataset.value = newValue;
    newElement.dataset.index = insertIndex;
    newElement.innerText = newValue;
    newElement.style.background = "#2ecc71";
    
    const newIndex = document.createElement("div");
    newIndex.className = "array-index";
    newIndex.style.marginTop = "8px";
    newIndex.style.fontSize = "14px";
    newIndex.style.color = "var(--muted)";
    newIndex.style.fontWeight = "600";
    newIndex.innerText = insertIndex;
    
    newWrapper.appendChild(newElement);
    newWrapper.appendChild(newIndex);
    container.appendChild(newWrapper);
    
    await sleep(300);
    
    // 新元素出现动画
    newWrapper.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    newWrapper.style.opacity = "1";
    newWrapper.style.transform = "scale(1)";
    
    await sleep(500);
    
    // 恢复正常颜色
    newElement.style.background = "";
  }
  
  // 更新数组
  currentArray.splice(insertIndex, 0, newValue);
  
  // 更新所有下标（因为插入后下标都变了）
  const allWrappers = Array.from(container.children);
  allWrappers.forEach((wrapper, idx) => {
    const indexEl = wrapper.querySelector(".array-index");
    if (indexEl) indexEl.innerText = idx;
    wrapper.dataset.index = idx;
    const element = wrapper.querySelector(".array-element");
    if (element) element.dataset.index = idx;
  });
  
  if (hintEl) {
    hintEl.innerText = `✓ 插入完成！数组: [${currentArray.join(", ")}]`;
    hintEl.style.color = "#2ecc71";
  }
  
  logEvent("array_insert", `index=${insertIndex}, value=${newValue}`);
  await sleep(1000);
  if (hintEl) hintEl.innerText = "";
}

// 删除元素
async function deleteElement() {
  const container = document.getElementById("array-container");
  const hintEl = document.getElementById("operation-hint");
  if (!container || currentArray.length === 0) return;
  
  // 确定删除位置
  let deleteIndex;
  if (deleteMode === 'middle') {
    // 中间位置：选择数组中间位置
    deleteIndex = Math.floor(currentArray.length / 2);
    deleteMode = 'end'; // 下次改为末尾
  } else {
    // 末尾位置
    deleteIndex = currentArray.length - 1;
    deleteMode = 'middle'; // 下次改为中间
  }
  
  const deletedValue = currentArray[deleteIndex];
  
  // 显示提示
  if (hintEl) {
    hintEl.innerText = `正在删除：下标 ${deleteIndex}，元素值为 ${deletedValue}`;
    hintEl.style.color = "#e74c3c";
  }
  await sleep(800);
  
  // 获取要删除的元素
  const wrappers = Array.from(container.children);
  const targetWrapper = wrappers[deleteIndex];
  
  if (!targetWrapper) return;
  
  const targetElement = targetWrapper.querySelector(".array-element");
  
  // 高亮要删除的元素
  if (targetElement) {
    targetElement.style.background = "#e74c3c";
    targetElement.style.transform = "scale(1.15)";
  }
  
  await sleep(600);
  
  // 如果是中间删除，需要移动后续元素
  if (deleteIndex < currentArray.length - 1) {
    // 后续元素向左移动
    for (let i = deleteIndex + 1; i < currentArray.length; i++) {
      const wrapper = wrappers[i];
      if (wrapper) {
        wrapper.style.transition = "transform 0.6s ease";
        wrapper.style.transform = "translateX(-72px)"; // 向左移动一个元素宽度(60px)+间距(12px)
      }
    }
    
    await sleep(600);
    
    // 删除元素消失动画
    if (targetElement) {
      targetElement.style.transition = "all 0.4s ease";
      targetElement.style.transform = "scale(0)";
      targetElement.style.opacity = "0";
    }
    targetWrapper.style.transition = "opacity 0.4s ease";
    targetWrapper.style.opacity = "0";
    
    await sleep(400);
    
    // 移除元素
    targetWrapper.remove();
    
    // 恢复后续元素位置
    const remainingWrappers = Array.from(container.children);
    for (let i = deleteIndex; i < remainingWrappers.length; i++) {
      const wrapper = remainingWrappers[i];
      if (wrapper) {
        wrapper.style.transform = "translateX(0)";
      }
    }
    
    await sleep(600);
    
    // 更新后续元素的下标
    const allWrappers = Array.from(container.children);
    allWrappers.forEach((wrapper, idx) => {
      const indexEl = wrapper.querySelector(".array-index");
      if (indexEl) indexEl.innerText = idx;
      wrapper.dataset.index = idx;
      const element = wrapper.querySelector(".array-element");
      if (element) element.dataset.index = idx;
    });
    
  } else {
    // 末尾删除：直接删除
    if (targetElement) {
      targetElement.style.transition = "all 0.5s ease";
      targetElement.style.transform = "scale(0)";
      targetElement.style.opacity = "0";
    }
    targetWrapper.style.transition = "opacity 0.5s ease";
    targetWrapper.style.opacity = "0";
    
    await sleep(500);
    
    targetWrapper.remove();
  }
  
  // 更新数组
  currentArray.splice(deleteIndex, 1);
  
  if (hintEl) {
    if (currentArray.length > 0) {
      hintEl.innerText = `✓ 删除完成！数组: [${currentArray.join(", ")}]`;
    } else {
      hintEl.innerText = `✓ 删除完成！数组已为空`;
    }
    hintEl.style.color = "#e74c3c";
  }
  
  logEvent("array_delete", `index=${deleteIndex}, value=${deletedValue}`);
  await sleep(1000);
  if (hintEl) hintEl.innerText = "";
}

function resetArray() {
  currentArray = [...DEFAULT_ARRAY];
  deleteMode = 'middle';
  insertMode = 'middle';
  renderArray();
  const hintEl = document.getElementById("operation-hint");
  if (hintEl) {
    hintEl.innerText = "已重置为初始数组";
    hintEl.style.color = "#3498db";
    setTimeout(() => { if (hintEl) hintEl.innerText = ""; }, 2000);
  }
  logEvent("array_reset");
}

function checkAnswer(ans) {
  const out = document.getElementById("quiz-result");
  if (!out) return;
  
  // 在数组中间位置插入需要移动后续元素，时间复杂度是 O(n)
  if (ans === "O(n)") {
    out.innerText = "✔ 正确！在数组中间位置插入元素需要移动后续元素，时间复杂度是 O(n)。+20 分";
    out.style.color = "#2ecc71";
    addScore(20);
    unlockBadge("starter");
    markCompleted("array");
  } else {
    out.innerText = "✖ 错误。在数组中间位置插入需要移动后续元素，时间复杂度是 O(n)。再试试。";
    out.style.color = "#e74c3c";
    addScore(-2);
  }
}

async function doAIHint(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成提示...";
  if (btn) btn.disabled = true;
  addScore(-5);
  logEvent("ai_hint_array");
  const ans = await aiCall("/hint", "数组在中间位置插入元素的时间复杂度是多少？请给个提示");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_hint_result");
}

async function doAIExplain(btn) {
  const out = document.getElementById("ai-output");
  if (out) out.innerText = "AI 正在生成解释...";
  if (btn) btn.disabled = true;
  addScore(-10);
  logEvent("ai_explain_array");
  const ans = await aiCall("/explain", "请解释数组插入和删除操作的时间复杂度，为什么中间操作是O(n)");
  if (out) out.innerText = ans;
  if (btn) btn.disabled = false;
  logEvent("ai_explain_result");
}

function initArray() {
  initCommonUI();
  renderArray();

  const insertBtn = document.getElementById("insert-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (insertBtn) insertBtn.addEventListener("click", () => { 
    insertElement(); 
    logEvent("array_insert_click"); 
  });
  
  if (deleteBtn) deleteBtn.addEventListener("click", () => { 
    deleteElement(); 
    logEvent("array_delete_click"); 
  });
  
  if (resetBtn) resetBtn.addEventListener("click", resetArray);
  
  if (completeBtn) completeBtn.addEventListener("click", () => { 
    markCompleted("array"); 
    unlockBadge("starter"); 
    addScore(10); 
  });

  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });

  if (aiHintBtn) aiHintBtn.addEventListener("click", () => doAIHint(aiHintBtn));
  if (aiExplainBtn) aiExplainBtn.addEventListener("click", () => doAIExplain(aiExplainBtn));
}

document.addEventListener("DOMContentLoaded", initArray);
