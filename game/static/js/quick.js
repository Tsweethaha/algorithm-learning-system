const sleep = ms => new Promise(res => setTimeout(res, ms));

// 快速排序数组
const QUICK_SORT_ARRAY = [64, 25, 12, 22, 11];
let recursionLevel = 0; // 递归层级

// 渲染快速排序可视化
function renderQuickSort(arr, left, right, pivotIdx, leftPtr, rightPtr, swappingIndices = [], statusMessage = '', isComplete = false, isRecursive = false) {
  const area = document.getElementById("visual-area");
  if (!area) return;

  let html = '<div class="quick-array-container">';
  
  arr.forEach((value, index) => {
    let elementClass = 'normal';
    let pointerLabel = '';
    
    // 判断元素是否在当前处理的区间内
    if (index >= left && index <= right) {
      elementClass = 'in-range';
    }
    
    // 判断元素状态
    if (swappingIndices.includes(index)) {
      elementClass = 'swapping';
    } else if (index === pivotIdx) {
      elementClass = 'pivot';
      pointerLabel = '<div class="binary-pointer-label">pivot</div>';
    } else if (index === leftPtr) {
      elementClass = 'left-pointer';
      pointerLabel = '<div class="binary-pointer-label">i</div>';
    } else if (index === rightPtr) {
      elementClass = 'right-pointer';
      pointerLabel = '<div class="binary-pointer-label">j</div>';
    }
    
    // 已排序的元素（在当前区间外且已确定位置）
    if (index < left || index > right) {
      // 检查是否已排序（简化处理，实际需要更复杂的判断）
      if (isComplete && index < arr.length) {
        elementClass = 'sorted';
      }
    }
    
    html += `
      <div class="quick-element-wrapper">
        ${pointerLabel}
        <div class="quick-element ${elementClass}">${value}</div>
        <div class="quick-index">${index}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  // 添加状态提示
  if (statusMessage) {
    let statusClass = 'quick-status';
    if (isComplete) {
      statusClass += ' complete';
    } else if (isRecursive) {
      statusClass += ' recursive';
    }
    html += `<div class="${statusClass}">${statusMessage}</div>`;
  }
  
  area.innerHTML = html;
}

// 分区函数（使用Lomuto分区方案，更直观）
async function partition(arr, left, right, level) {
  // 选择最右侧元素作为pivot
  const pivot = arr[right];
  const pivotIdx = right;
  
  renderQuickSort(arr, left, right, pivotIdx, -1, -1, [], 
    `递归层级 ${level}：选择 pivot = ${pivot}（位置 ${right}）`, false, true);
  await sleep(1000);
  
  let i = left - 1;  // 小于pivot的元素的最后一个位置
  
  renderQuickSort(arr, left, right, pivotIdx, i, left, [], 
    `初始化：i = ${i}（小于pivot区间的末尾），开始扫描区间 [${left}, ${right - 1}]`);
  await sleep(1000);
  
  // 从左到右扫描，将小于pivot的元素放到左侧
  for (let j = left; j < right; j++) {
    renderQuickSort(arr, left, right, pivotIdx, i, j, [], 
      `比较：arr[${j}](${arr[j]}) 与 pivot(${pivot})`);
    await sleep(800);
    
    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        renderQuickSort(arr, left, right, pivotIdx, i, j, [i, j], 
          `arr[${j}](${arr[j]}) <= pivot，交换 arr[${i}](${arr[i]}) 与 arr[${j}](${arr[j]})`);
        await sleep(800);
        
        [arr[i], arr[j]] = [arr[j], arr[i]];
        renderQuickSort(arr, left, right, pivotIdx, i, j, [i, j], 
          `交换完成：arr[${i}] = ${arr[i]}，arr[${j}] = ${arr[j]}`);
        await sleep(800);
      } else {
        renderQuickSort(arr, left, right, pivotIdx, i, j, [], 
          `arr[${j}](${arr[j]}) <= pivot，已在正确位置，i 移动到 ${i}`);
        await sleep(600);
      }
    } else {
      renderQuickSort(arr, left, right, pivotIdx, i, j, [], 
        `arr[${j}](${arr[j]}) > pivot，跳过`);
      await sleep(600);
    }
  }
  
  // 将pivot放到最终位置（i+1）
  const pivotPos = i + 1;
  if (pivotPos !== right) {
    renderQuickSort(arr, left, right, pivotIdx, i, -1, [pivotPos, right], 
      `将 pivot(${pivot}) 与 arr[${pivotPos}](${arr[pivotPos]}) 交换`);
    await sleep(800);
    
    [arr[pivotPos], arr[right]] = [arr[right], arr[pivotPos]];
    renderQuickSort(arr, left, right, pivotPos, -1, -1, [], 
      `pivot ${pivot} 已就位，位置为 ${pivotPos}`);
    await sleep(1000);
  } else {
    renderQuickSort(arr, left, right, right, -1, -1, [], 
      `pivot ${pivot} 已在正确位置 ${right}`);
    await sleep(800);
  }
  
  return pivotPos;
}

// 快速排序主函数
async function quickSort(arr, left, right, level = 0) {
  if (left >= right) {
    if (left === right) {
      renderQuickSort(arr, left, right, -1, -1, -1, [], 
        `递归层级 ${level}：区间 [${left}, ${right}] 长度为 1，已有序`, false, true);
      await sleep(800);
    }
    return;
  }
  
  // 显示当前递归层级和处理区间
  renderQuickSort(arr, left, right, -1, -1, -1, [], 
    `递归层级 ${level}：处理区间 [${left}, ${right}]，元素：[${arr.slice(left, right + 1).join(', ')}]`, false, true);
  await sleep(1000);
  
  // 执行分区
  const pivotPos = await partition(arr, left, right, level);
  
  // 显示左右子区间
  renderQuickSort(arr, left, right, pivotPos, -1, -1, [], 
    `分区完成：左子区间 [${left}, ${pivotPos - 1}]，右子区间 [${pivotPos + 1}, ${right}]`);
  await sleep(1000);
  
  // 递归处理左子区间
  if (left < pivotPos - 1) {
    await quickSort(arr, left, pivotPos - 1, level + 1);
  } else if (left === pivotPos - 1) {
    renderQuickSort(arr, left, pivotPos - 1, -1, -1, -1, [], 
      `递归层级 ${level + 1}：区间 [${left}, ${pivotPos - 1}] 长度为 1，已有序`, false, true);
    await sleep(800);
  }
  
  // 递归处理右子区间
  if (pivotPos + 1 < right) {
    await quickSort(arr, pivotPos + 1, right, level + 1);
  } else if (pivotPos + 1 === right) {
    renderQuickSort(arr, pivotPos + 1, right, -1, -1, -1, [], 
      `递归层级 ${level + 1}：区间 [${pivotPos + 1}, ${right}] 长度为 1，已有序`, false, true);
    await sleep(800);
  }
}

// 执行快速排序动画
async function playQuickSort() {
  const arr = [...QUICK_SORT_ARRAY];
  recursionLevel = 0;
  
  // 初始化显示
  renderQuickSort(arr, 0, arr.length - 1, -1, -1, -1, [], 
    `开始快速排序，数组：[${arr.join(', ')}]`);
  await sleep(1000);
  
  // 执行快速排序
  await quickSort(arr, 0, arr.length - 1, 0);
  
  // 排序完成
  renderQuickSort(arr, 0, arr.length - 1, -1, -1, -1, [], 
    `快速排序完成！最终数组：[${arr.join(', ')}]`, true);
  logEvent("quick_sort_done", {array: arr.join(',')});
}

// 初始化快速排序页面
function initQuick() {
  initCommonUI();
  
  // 初始渲染
  renderQuickSort(QUICK_SORT_ARRAY, 0, QUICK_SORT_ARRAY.length - 1, -1, -1, -1, [], 
    `无序数组：[${QUICK_SORT_ARRAY.join(', ')}]。点击「开始快速排序」按钮开始排序。`);

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (playBtn) {
    playBtn.onclick = () => { 
      logEvent("quick_play"); 
      playBtn.disabled = true;
      playQuickSort().then(() => {
        playBtn.disabled = false;
      });
    };
  }
  
  if (resetBtn) {
    resetBtn.onclick = () => { 
      renderQuickSort(QUICK_SORT_ARRAY, 0, QUICK_SORT_ARRAY.length - 1, -1, -1, -1, [], 
        `已重置。无序数组：[${QUICK_SORT_ARRAY.join(', ')}]。点击「开始快速排序」按钮开始排序。`); 
      logEvent("quick_reset");
      recursionLevel = 0;
      // 重置测试题结果
      const quizResult = document.getElementById("quiz-result");
      if (quizResult) {
        quizResult.innerText = "";
      }
    };
  }
  
  if (completeBtn) {
    completeBtn.onclick = () => { 
      markCompleted("quick"); 
      addScore(10); 
      unlockBadge("starter");
      logEvent("quick_complete");
    };
  }

  // 处理测试题
  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });
  
  function checkAnswer(ans) {
    const out = document.getElementById("quiz-result");
    if (!out) return;
    
    // 第一轮分区时，pivot是最右侧元素，即11
    if (ans === "11") {
      out.innerText = "✔ 正确！第一轮分区时，选择最右侧元素 11 作为 pivot。+20 分";
      out.style.color = "#2ecc71";
      addScore(20);
      unlockBadge("starter");
      markCompleted("quick");
      logEvent("quick_quiz_correct");
    } else {
      out.innerText = "✖ 错误。第一轮分区时，选择最右侧元素 11 作为 pivot。再试试。";
      out.style.color = "#e74c3c";
      addScore(-2);
      logEvent("quick_quiz_wrong", ans);
    }
  }

  if (aiHintBtn) {
    aiHintBtn.onclick = async () => {
      aiHintBtn.disabled = true;
      const out = document.getElementById("ai-output");
      if (out) out.innerText = "AI 正在生成提示...";
      addScore(-5);
      logEvent("ai_hint_quick");
      const ans = await aiCall("/hint", "解释快速排序分区的核心思想");
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
      logEvent("ai_explain_quick");
      const ans = await aiCall("/explain", "快速排序的平均时间复杂度为何是 O(n log n)");
      if (out) out.innerText = ans;
      aiExplainBtn.disabled = false;
    };
  }
}

window.customAlgoInit = function() { 
  initQuick(); 
  return true; 
};
