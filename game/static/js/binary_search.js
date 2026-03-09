const sleep = ms => new Promise(res => setTimeout(res, ms));

// 二分查找数组和目标值
const BINARY_SEARCH_ARRAY = [2, 5, 8, 12, 16, 23, 38, 45, 56];
const TARGET = 23; // 可修改目标值

// 渲染二分查找可视化
function renderBinarySearch(arr, left, right, mid, target, status, isFound = false) {
  const area = document.getElementById("visual-area");
  if (!area) return;

  let html = '<div class="binary-array-container">';
  
  arr.forEach((value, index) => {
    let elementClass = 'normal';
    let pointerLabel = '';
    
    // 判断元素状态
    if (isFound && index === mid) {
      elementClass = 'found';
    } else if (index === mid) {
      elementClass = 'mid';
    } else if (index === left) {
      elementClass = 'left';
      pointerLabel = '<div class="binary-pointer-label">left</div>';
    } else if (index === right) {
      elementClass = 'right';
      pointerLabel = '<div class="binary-pointer-label">right</div>';
    } else if (index >= left && index <= right) {
      elementClass = 'in-range';
    }
    
    html += `
      <div class="binary-element-wrapper">
        ${pointerLabel}
        <div class="binary-element ${elementClass}">${value}</div>
        <div class="binary-index">${index}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  // 状态提示
  let statusClass = '';
  if (isFound) {
    statusClass = 'success';
  } else if (status.includes('失败') || status.includes('不存在')) {
    statusClass = 'failure';
  }
  
  html += `<div class="binary-status ${statusClass}">${status}</div>`;
  
  area.innerHTML = html;
}

// 执行二分查找动画
async function playBinarySearch() {
  const arr = BINARY_SEARCH_ARRAY;
  const target = TARGET;
  let left = 0;
  let right = arr.length - 1;
  let step = 0;
  
  // 初始化显示
  renderBinarySearch(arr, left, right, -1, target, `开始查找目标值 ${target}，初始化：left = ${left}, right = ${right}`);
  await sleep(1000);
  
  while (left <= right) {
    step++;
    
    // 步骤1：计算 mid
    const mid = Math.floor((left + right) / 2);
    renderBinarySearch(arr, left, right, mid, target, 
      `步骤 ${step}：计算 mid = (${left} + ${right}) // 2 = ${mid}`);
    await sleep(1200);
    
    // 步骤2：高亮 mid 元素并比较
    renderBinarySearch(arr, left, right, mid, target, 
      `比较：target(${target}) 与 arr[${mid}](${arr[mid]})`);
    await sleep(1200);
    
    // 步骤3：根据比较结果更新区间
    if (arr[mid] === target) {
      // 找到目标
      renderBinarySearch(arr, left, right, mid, target, 
        `查找成功！arr[${mid}] = ${arr[mid]} = target(${target})，位置为 index = ${mid}`, true);
      logEvent("binary_search_done", {target, found: true, index: mid, steps: step});
      return;
    } else if (arr[mid] < target) {
      // target 在右区间
      renderBinarySearch(arr, left, right, mid, target, 
        `target(${target}) > arr[${mid}](${arr[mid]})，向右区间查找，更新 left = ${mid + 1}`);
      await sleep(1200);
      left = mid + 1;
      if (left <= right) {
        renderBinarySearch(arr, left, right, -1, target, 
          `新的查找区间：[${left}, ${right}]`);
        await sleep(1000);
      }
    } else {
      // target 在左区间
      renderBinarySearch(arr, left, right, mid, target, 
        `target(${target}) < arr[${mid}](${arr[mid]})，向左区间查找，更新 right = ${mid - 1}`);
      await sleep(1200);
      right = mid - 1;
      if (left <= right) {
        renderBinarySearch(arr, left, right, -1, target, 
          `新的查找区间：[${left}, ${right}]`);
        await sleep(1000);
      }
    }
  }
  
  // 未找到
  renderBinarySearch(arr, -1, -1, -1, target, 
    `查找失败：left(${left}) > right(${right})，元素不存在`, false);
  logEvent("binary_search_done", {target, found: false, steps: step});
}

// 初始化二分查找页面
function initBinary() {
  initCommonUI();
  
  // 初始渲染
  renderBinarySearch(BINARY_SEARCH_ARRAY, 0, BINARY_SEARCH_ARRAY.length - 1, -1, TARGET, 
    `有序数组：[${BINARY_SEARCH_ARRAY.join(', ')}]，目标值：${TARGET}。点击「开始」按钮开始查找。`);

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (playBtn) {
    playBtn.onclick = () => { 
      logEvent("binary_play"); 
      playBtn.disabled = true;
      playBinarySearch().then(() => {
        playBtn.disabled = false;
      });
    };
  }
  
  if (resetBtn) {
    resetBtn.onclick = () => { 
      renderBinarySearch(BINARY_SEARCH_ARRAY, 0, BINARY_SEARCH_ARRAY.length - 1, -1, TARGET, 
        `已重置。有序数组：[${BINARY_SEARCH_ARRAY.join(', ')}]，目标值：${TARGET}。点击「开始」按钮开始查找。`); 
      logEvent("binary_reset");
      // 重置测试题结果
      const quizResult = document.getElementById("quiz-result");
      if (quizResult) {
        quizResult.innerText = "";
      }
    };
  }
  
  if (completeBtn) {
    completeBtn.onclick = () => { 
      markCompleted("binary_search"); 
      addScore(10); 
      unlockBadge("starter");
      logEvent("binary_complete");
    };
  }

  // 处理测试题
  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });
  
  function checkAnswer(ans) {
    const out = document.getElementById("quiz-result");
    if (!out) return;
    
    // 第一次 mid = (0 + 8) // 2 = 4，arr[4] = 16
    // 正确答案是 4
    if (ans === "4") {
      out.innerText = "✔ 正确！第一次 mid = (0 + 8) // 2 = 4，arr[4] = 16。+20 分";
      out.style.color = "#2ecc71";
      addScore(20);
      unlockBadge("starter");
      markCompleted("binary_search");
      logEvent("binary_quiz_correct");
    } else {
      out.innerText = "✖ 错误。第一次 mid = (0 + 8) // 2 = 4。再试试。";
      out.style.color = "#e74c3c";
      addScore(-2);
      logEvent("binary_quiz_wrong", ans);
    }
  }

  if (aiHintBtn) {
    aiHintBtn.onclick = async () => {
      aiHintBtn.disabled = true;
      const out = document.getElementById("ai-output");
      if (out) out.innerText = "AI 正在生成提示...";
      addScore(-5);
      logEvent("ai_hint_binary");
      const ans = await aiCall("/hint", "解释二分查找如何更新左右边界");
      if (out) out.innerText = ans;
      aiHintBtn.disabled = false;
    };
  }
  
  if (aiExplainBtn) {
    aiExplainBtn.onclick = async () => {
      aiExplainBtn.disabled = true;
      const out = document.getElementById("ai-output");
      if (out) out.innerText = "AI 正在生成解释...";
      addScore(-10);
      logEvent("ai_explain_binary");
      const ans = await aiCall("/explain", "为什么二分查找要求有序数组");
      if (out) out.innerText = ans;
      aiExplainBtn.disabled = false;
    };
  }
}

window.customAlgoInit = function() { 
  initBinary(); 
  return true; 
};
