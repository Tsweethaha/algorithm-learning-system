const sleep = ms => new Promise(res => setTimeout(res, ms));

// 插入排序数组
const INSERTION_SORT_ARRAY = [64, 25, 12, 22, 11];

// 渲染插入排序可视化
function renderInsertionSort(arr, sortedEnd, keyIdx, comparingIdx, shiftingIdx, statusMessage = '', isComplete = false) {
  const area = document.getElementById("visual-area");
  if (!area) return;

  let html = '<div class="insertion-array-container">';
  
  arr.forEach((value, index) => {
    let elementClass = 'unsorted';
    let pointerLabel = '';
    
    // 判断元素状态
    if (index < sortedEnd) {
      elementClass = 'sorted';
    } else if (index === keyIdx) {
      elementClass = 'key';
      pointerLabel = '<div class="binary-pointer-label">key</div>';
    } else if (index === comparingIdx) {
      elementClass = 'comparing';
      pointerLabel = '<div class="binary-pointer-label">比较</div>';
    } else if (index === shiftingIdx) {
      elementClass = 'shifting';
      pointerLabel = '<div class="binary-pointer-label">后移</div>';
    }
    
    html += `
      <div class="insertion-element-wrapper">
        ${pointerLabel}
        <div class="insertion-element ${elementClass}">${value}</div>
        <div class="insertion-index">${index}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  // 添加状态提示
  if (statusMessage) {
    const statusClass = isComplete ? 'insertion-status complete' : 'insertion-status';
    html += `<div class="${statusClass}">${statusMessage}</div>`;
  }
  
  area.innerHTML = html;
}

// 执行插入排序动画
async function playInsertionSort() {
  const arr = [...INSERTION_SORT_ARRAY];
  const n = arr.length;
  let sortedEnd = 1; // 已排序区间的结束位置（不包含），默认第0个元素已排序
  
  // 初始化显示
  renderInsertionSort(arr, sortedEnd, -1, -1, -1, `开始插入排序，数组：[${arr.join(', ')}]，位置 0 的元素 ${arr[0]} 视为已排序`);
  await sleep(1200);
  
  // 从下标 1 开始，依次执行插入操作
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    const originalKeyIdx = i; // 保存key的原始位置
    
    // 步骤1：高亮显示 key
    renderInsertionSort(arr, sortedEnd, i, -1, -1, `第 ${i} 轮：取出待插入元素 key = ${key}`);
    await sleep(1000);
    
    // 步骤2：向左依次与已排序区间元素比较
    let j = i - 1;
    let insertPosition = i; // 记录key的插入位置（初始为i）
    
    while (j >= 0 && arr[j] > key) {
      // 高亮当前比较的元素和key
      renderInsertionSort(arr, sortedEnd, insertPosition, j, -1, `比较：key(${key}) 与 arr[${j}](${arr[j]})，${arr[j]} > ${key}`);
      await sleep(1000);
      
      // 步骤3：左侧元素大于 key，元素后移
      renderInsertionSort(arr, sortedEnd, insertPosition, j, j, `元素 ${arr[j]} 后移，从位置 ${j} 移动到位置 ${j + 1}`);
      await sleep(800);
      
      // 执行后移操作
      arr[j + 1] = arr[j];
      renderInsertionSort(arr, sortedEnd, insertPosition, j, j, `元素 ${arr[j + 1]} 已移动到位置 ${j + 1}，key(${key}) 将插入到位置 ${j}`);
      await sleep(800);
      
      insertPosition = j; // key的插入位置向左移动
      j--;
    }
    
    // 步骤4：找到插入位置，将 key 插入
    if (insertPosition !== originalKeyIdx) {
      // key 需要插入到新位置
      arr[insertPosition] = key;
      renderInsertionSort(arr, sortedEnd, insertPosition, -1, -1, `将 key(${key}) 插入到位置 ${insertPosition}`);
      await sleep(1000);
    } else {
      // key 已经在正确位置，无需移动
      renderInsertionSort(arr, sortedEnd, i, -1, -1, `key(${key}) 已在正确位置，无需移动`);
      await sleep(800);
    }
    
    // 步骤5：插入完成后，已排序区间向右扩展一位
    sortedEnd = i + 1;
    renderInsertionSort(arr, sortedEnd, -1, -1, -1, `位置 ${i} 已排序，已排序区间：[0, ${sortedEnd - 1}]，当前数组：[${arr.join(', ')}]`);
    await sleep(1000);
  }
  
  // 排序完成
  sortedEnd = n;
  renderInsertionSort(arr, sortedEnd, -1, -1, -1, `插入排序完成！最终数组：[${arr.join(', ')}]`, true);
  logEvent("insertion_sort_done", {array: arr.join(',')});
}

// 初始化插入排序页面
function initInsertion() {
  initCommonUI();
  
  // 初始渲染（第0个元素视为已排序）
  renderInsertionSort(INSERTION_SORT_ARRAY, 1, -1, -1, -1, `无序数组：[${INSERTION_SORT_ARRAY.join(', ')}]。位置 0 的元素 ${INSERTION_SORT_ARRAY[0]} 视为已排序。点击「开始插入排序」按钮开始排序。`);

  const playBtn = document.getElementById("play-btn");
  const resetBtn = document.getElementById("reset-btn");
  const completeBtn = document.getElementById("complete-btn");
  const aiHintBtn = document.getElementById("ai-hint-btn");
  const aiExplainBtn = document.getElementById("ai-explain-btn");

  if (playBtn) {
    playBtn.onclick = () => { 
      logEvent("insertion_play"); 
      playBtn.disabled = true;
      playInsertionSort().then(() => {
        playBtn.disabled = false;
      });
    };
  }
  
  if (resetBtn) {
    resetBtn.onclick = () => { 
      renderInsertionSort(INSERTION_SORT_ARRAY, 1, -1, -1, -1, `已重置。无序数组：[${INSERTION_SORT_ARRAY.join(', ')}]。位置 0 的元素 ${INSERTION_SORT_ARRAY[0]} 视为已排序。点击「开始插入排序」按钮开始排序。`); 
      logEvent("insertion_reset");
      // 重置测试题结果
      const quizResult = document.getElementById("quiz-result");
      if (quizResult) {
        quizResult.innerText = "";
      }
    };
  }
  
  if (completeBtn) {
    completeBtn.onclick = () => { 
      markCompleted("insertion"); 
      addScore(10); 
      unlockBadge("starter");
      logEvent("insertion_complete");
    };
  }

  // 处理测试题
  document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn.dataset.answer));
  });
  
  function checkAnswer(ans) {
    const out = document.getElementById("quiz-result");
    if (!out) return;
    
    // 第一轮插入元素 25 时，需要将 64 后移
    if (ans === "64") {
      out.innerText = "✔ 正确！第一轮插入 25 时，需要将 64 后移。+20 分";
      out.style.color = "#2ecc71";
      addScore(20);
      unlockBadge("starter");
      markCompleted("insertion");
      logEvent("insertion_quiz_correct");
    } else {
      out.innerText = "✖ 错误。第一轮插入 25 时，需要将 64 后移。再试试。";
      out.style.color = "#e74c3c";
      addScore(-2);
      logEvent("insertion_quiz_wrong", ans);
    }
  }

  if (aiHintBtn) {
    aiHintBtn.onclick = async () => {
      aiHintBtn.disabled = true;
      const out = document.getElementById("ai-output");
      if (out) out.innerText = "AI 正在生成提示...";
      addScore(-5);
      logEvent("ai_hint_insertion");
      const ans = await aiCall("/hint", "插入排序为什么要从右向左比较");
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
      logEvent("ai_explain_insertion");
      const ans = await aiCall("/explain", "插入排序的稳定性由什么保证");
      if (out) out.innerText = ans;
      aiExplainBtn.disabled = false;
    };
  }
}

window.customAlgoInit = function() { 
  initInsertion(); 
  return true; 
};
