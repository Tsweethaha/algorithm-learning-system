const sleep = ms => new Promise(res => setTimeout(res, ms));

// 选择排序数组
const SELECTION_SORT_ARRAY = [64, 25, 12, 22, 11];

// 渲染选择排序可视化
function renderSelectionSort(arr, sortedEnd, currentMinIdx, comparingIdx, swappingIndices = [], statusMessage = '', isComplete = false) {
  const area = document.getElementById("visual-area");
  if (!area) return;

  let html = '<div class="selection-array-container">';
  
  arr.forEach((value, index) => {
    let elementClass = 'unsorted';
    let pointerLabel = '';
    
    // 判断元素状态
    if (swappingIndices.includes(index)) {
      elementClass = 'swapping';
    } else if (index < sortedEnd) {
      elementClass = 'sorted';
    } else if (index === currentMinIdx) {
      elementClass = 'current-min';
      pointerLabel = '<div class="binary-pointer-label">最小值</div>';
    } else if (index === comparingIdx) {
      elementClass = 'comparing';
      pointerLabel = '<div class="binary-pointer-label">比较中</div>';
    }
    
    html += `
      <div class="selection-element-wrapper">
        ${pointerLabel}
        <div class="selection-element ${elementClass}">${value}</div>
        <div class="selection-index">${index}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  // 添加状态提示
  if (statusMessage) {
    const statusClass = isComplete ? 'selection-status complete' : 'selection-status';
    html += `<div class="${statusClass}">${statusMessage}</div>`;
  }
  
  area.innerHTML = html;
}

// 执行选择排序动画
async function playSelectionSort() {
  const arr = [...SELECTION_SORT_ARRAY];
  const n = arr.length;
  let sortedEnd = 0; // 已排序区间的结束位置（不包含）
  
  // 初始化显示
  renderSelectionSort(arr, sortedEnd, -1, -1, [], `开始选择排序，数组：[${arr.join(', ')}]`);
  await sleep(1000);
  
  // 外层循环：从左到右逐步推进已排序区间
  for (let i = 0; i < n - 1; i++) {
    renderSelectionSort(arr, sortedEnd, -1, -1, [], `第 ${i + 1} 轮：在位置 ${i} 处寻找最小值`);
    await sleep(800);
    
    // 步骤1：假设当前位置 i 为当前最小值
    let minIdx = i;
    renderSelectionSort(arr, sortedEnd, minIdx, -1, [], `假设位置 ${i} 的元素 ${arr[i]} 为当前最小值`);
    await sleep(1000);
    
    // 步骤2：依次扫描未排序区间，逐个比较
    for (let j = i + 1; j < n; j++) {
      // 高亮当前比较的元素
      renderSelectionSort(arr, sortedEnd, minIdx, j, [], `比较：arr[${j}](${arr[j]}) 与当前最小值 arr[${minIdx}](${arr[minIdx]})`);
      await sleep(1000);
      
      // 步骤3：若发现更小元素，更新最小值位置
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        renderSelectionSort(arr, sortedEnd, minIdx, j, [], `发现更小值 ${arr[j]}，更新最小值位置为 ${j}`);
        await sleep(1200);
      } else {
        renderSelectionSort(arr, sortedEnd, minIdx, j, [], `arr[${j}](${arr[j]}) >= arr[${minIdx}](${arr[minIdx]})，继续扫描`);
        await sleep(800);
      }
    }
    
    // 步骤4：一轮扫描结束后，将最小值与位置 i 处元素交换
    if (minIdx !== i) {
      renderSelectionSort(arr, sortedEnd, minIdx, -1, [], `交换：将最小值 ${arr[minIdx]} 与位置 ${i} 的元素 ${arr[i]} 交换`);
      await sleep(800);
      
      // 高亮要交换的两个元素
      renderSelectionSort(arr, sortedEnd, minIdx, -1, [i, minIdx], `准备交换位置 ${i} 和位置 ${minIdx} 的元素`);
      await sleep(600);
      
      // 执行交换动画
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      renderSelectionSort(arr, sortedEnd, i, -1, [i, minIdx], `交换完成：${arr[i]} 已移动到位置 ${i}`);
      await sleep(800);
      
      // 恢复正常显示
      renderSelectionSort(arr, sortedEnd, -1, -1, [], `交换完成，当前数组：[${arr.join(', ')}]`);
      await sleep(500);
    } else {
      renderSelectionSort(arr, sortedEnd, minIdx, -1, [], `位置 ${i} 的元素 ${arr[i]} 已经是最小值，无需交换`);
      await sleep(800);
    }
    
    // 步骤5：完成交换后，位置 i 进入已排序区间
    sortedEnd = i + 1;
    renderSelectionSort(arr, sortedEnd, -1, -1, [], `位置 ${i} 已排序，当前数组：[${arr.join(', ')}]`);
    await sleep(1000);
  }
  
  // 排序完成
  sortedEnd = n;
  renderSelectionSort(arr, sortedEnd, -1, -1, [], `选择排序完成！最终数组：[${arr.join(', ')}]`, true);
  logEvent("selection_sort_done", {array: arr.join(',')});
}

// 初始化选择排序页面
function initSelection() {
  initCommonUI();
  
  // 初始渲染
  renderSelectionSort(SELECTION_SORT_ARRAY, 0, -1, -1, [], `无序数组：[${SELECTION_SORT_ARRAY.join(', ')}]。点击「开始」按钮开始排序。`);

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (playBtn) {
    playBtn.onclick = () => { 
      logEvent("selection_play"); 
      playBtn.disabled = true;
      playSelectionSort().then(() => {
        playBtn.disabled = false;
      });
    };
  }
  
  if (resetBtn) {
    resetBtn.onclick = () => { 
      renderSelectionSort(SELECTION_SORT_ARRAY, 0, -1, -1, [], `已重置。无序数组：[${SELECTION_SORT_ARRAY.join(', ')}]。点击「开始」按钮开始排序。`); 
      logEvent("selection_reset");
      // 重置测试题结果
      const quizResult = document.getElementById("quiz-result");
      if (quizResult) {
        quizResult.innerText = "";
      }
    };
  }
  
  if (completeBtn) {
    completeBtn.onclick = () => { 
      markCompleted("selection"); 
      addScore(10); 
      unlockBadge("starter");
      logEvent("selection_complete");
    };
  }

  // 处理测试题
  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });
  
  function checkAnswer(ans) {
    const out = document.getElementById("quiz-result");
    if (!out) return;
    
    // 第一轮结束后，最小值 11 会移动到位置 0
    if (ans === "0") {
      out.innerText = "✔ 正确！第一轮选择排序会将最小值 11 移动到位置 0。+20 分";
      out.style.color = "#2ecc71";
      addScore(20);
      unlockBadge("starter");
      markCompleted("selection");
      logEvent("selection_quiz_correct");
    } else {
      out.innerText = "✖ 错误。第一轮选择排序会将最小值移动到位置 0。再试试。";
      out.style.color = "#e74c3c";
      addScore(-2);
      logEvent("selection_quiz_wrong", ans);
    }
  }

  if (aiHintBtn) {
    aiHintBtn.onclick = async () => {
      aiHintBtn.disabled = true;
      const out = document.getElementById("ai-output");
      if (out) out.innerText = "AI 正在生成提示...";
      addScore(-5);
      logEvent("ai_hint_selection");
      const ans = await aiCall("/hint", "解释选择排序第一趟如何找最小值");
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
      logEvent("ai_explain_selection");
      const ans = await aiCall("/explain", "选择排序时间复杂度为何是 O(n^2)");
      if (out) out.innerText = ans;
      aiExplainBtn.disabled = false;
    };
  }
}

window.customAlgoInit = function() { 
  initSelection(); 
  return true; 
};
