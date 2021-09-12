const textMonitor = document.querySelector(".text-monitor");
const analysisBox = document.querySelector(".suggestion-box");
const idxMonitor = document.querySelector(".idx-monitor");
const countMonitor = document.querySelector(".count-monitor");

const resetBtn = document.querySelector(".reset-btn");
const selectAllBtn = document.querySelector(".select-all-btn");
const copyBtn = document.querySelector(".copy-btn");

const analysis = JSON.parse(localStorage.getItem("analysis"));
const originalText = JSON.parse(localStorage.getItem("original_text"));

const SELECTED_CLASSNAME = "selected";
const REPLACED_CLASSNAME = "replaced";
const MOUSEENTERTEXT_CLASSNAME = "mouseenter-text";

let currentStrLength = originalText.length;

const REMOVED_SPACE_SUGGESTION = "<생략>";
const REMOVED_SPACE_HOLDER = "";

function init() {
  setTextMonitor(originalText);
  updateReduceCount(0);

  if (analysis.length === 0) {
    let alertEmpty = document.createElement("span");
    alertEmpty.innerText = "수정할 부분이 없습니다.";
    alertEmpty.classList.add("alert-empty");
    analysisBox.appendChild(alertEmpty);
    return;
  }

  for (let i = 0; i < analysis.length; ++i) {
    let now = analysis[i];
    const block = makeAnalysisBlock(
      now.start_idx,
      now.prior_str,
      now.new_str,
      now.removed
    );
    block.id = `suggestion-${i}`;
    block.addEventListener("click", handleClickSuggestion);
    analysisBox.appendChild(block);
  }

  resetBtn.addEventListener("click", handleClickReset);
  selectAllBtn.addEventListener("click", handleClickSelectAll);
  copyBtn.addEventListener("click", handleClickCopy);
}

function makeAnalysisBlock(start_idx, prior_str, new_str, removed) {
  const eBlock = document.createElement("div");
  const eStartIdx = document.createElement("span");
  const ePriorStr = document.createElement("span");
  const eNewStr = document.createElement("span");
  const eRemoved = document.createElement("span");

  eBlock.classList.add("suggestion");
  eStartIdx.classList.add("sug-idx");
  ePriorStr.classList.add("sug-prior");
  eNewStr.classList.add("sug-new");
  eRemoved.classList.add("sug-removed");

  eStartIdx.innerText = parseInt(start_idx) + 1;
  ePriorStr.innerText = prior_str;
  eNewStr.innerText = new_str;
  eRemoved.innerText = removed;

  eBlock.appendChild(eStartIdx);
  eBlock.appendChild(ePriorStr);
  eBlock.appendChild(eNewStr);
  eBlock.appendChild(eRemoved);

  return eBlock;
}

function makeSpanStr(idx, str) {
  let newChar = document.createElement("span");
  newChar.innerText = str;
  newChar.id = `text-${idx}`;
  newChar.addEventListener("mouseenter", handleMouseenterChar);
  newChar.addEventListener("mouseleave", handleMouseleaveChar);
  return newChar;
}

function setTextMonitor(str) {
  while (textMonitor.firstChild) {
    textMonitor.firstChild.remove();
  }

  for (let i = 0; i < str.length; ++i) {
    textMonitor.appendChild(makeSpanStr(i, str[i]));
  }
}

function updateText(anaylsisNum, status) {
  const selectedText = document.getElementById(
    `text-${analysis[anaylsisNum].start_idx}`
  );
  let isReplaced = selectedText.classList.contains(REPLACED_CLASSNAME);

  if ((status && isReplaced) || (!status && !isReplaced)) {
    return;
  }

  if (status) {
    for (let i = 0; i < analysis[anaylsisNum].prior_str.length; ++i) {
      document
        .getElementById(`text-${analysis[anaylsisNum].start_idx + i}`)
        .remove();
    }

    let newStr;
    if (analysis[anaylsisNum].new_str == REMOVED_SPACE_SUGGESTION) {
      newStr = makeSpanStr(
        analysis[anaylsisNum].start_idx,
        REMOVED_SPACE_HOLDER
      );
    } else {
      newStr = makeSpanStr(
        analysis[anaylsisNum].start_idx,
        analysis[anaylsisNum].new_str
      );
    }

    newStr.classList.add(REPLACED_CLASSNAME);
    textMonitor.insertBefore(
      newStr,
      document.getElementById(
        `text-${
          analysis[anaylsisNum].start_idx +
          analysis[anaylsisNum].prior_str.length
        }`
      )
    );
  } else {
    document.getElementById(`text-${analysis[anaylsisNum].start_idx}`).remove();

    for (let i = 0; i < analysis[anaylsisNum].prior_str.length; ++i) {
      let newStr = makeSpanStr(
        analysis[anaylsisNum].start_idx + i,
        analysis[anaylsisNum].prior_str[i]
      );
      textMonitor.insertBefore(
        newStr,
        document.getElementById(
          `text-${
            analysis[anaylsisNum].start_idx +
            analysis[anaylsisNum].prior_str.length
          }`
        )
      );
    }
  }
}

function updateReduceCount(delta) {
  currentStrLength += delta;
  countMonitor.innerText = `${currentStrLength}자 / ${originalText.length}자`;
}

function resetReduceCount() {
  currentStrLength = originalText.length;
  countMonitor.innerText = `${currentStrLength}자 / ${originalText.length}자`;
}

function handleClickSuggestion(event) {
  let block; // 클릭된 suggestion 블럭

  if (event.target.classList.contains("suggestion")) {
    block = event.target;
  } else {
    block = event.target.parentElement;
  }

  let blockNum = block.id.substr(11);
  document
    .getElementById(`text-${analysis[blockNum].start_idx}`)
    .scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

  if (block.classList.contains(SELECTED_CLASSNAME)) {
    // 분석 해제
    block.classList.remove(SELECTED_CLASSNAME);
    updateText(blockNum, false);
    updateReduceCount(analysis[blockNum].removed);
  } else {
    // 분석 적용
    block.classList.add(SELECTED_CLASSNAME);
    updateText(blockNum, true);
    updateReduceCount(-analysis[blockNum].removed);
  }
}

function handleClickReset() {
  if (confirm("현재 변경사항을 모두 초기 상태로 되돌리시겠습니까?")) {
    setTextMonitor(originalText);
    const suggestions = analysisBox.querySelectorAll(".suggestion");

    for (let i = 0; i < suggestions.length; ++i) {
      suggestions[i].classList.remove(SELECTED_CLASSNAME);
      if (suggestions[i].classList.contains(SELECTED_CLASSNAME)) {
      }
    }

    resetReduceCount();
  }
}

function handleClickSelectAll() {
  let newReduceCount = 0;

  for (let i = 0; i < analysis.length; ++i) {
    let block = document.getElementById(`suggestion-${i}`);
    block.classList.add(SELECTED_CLASSNAME);
    updateText(i, true);
    newReduceCount += analysis[i].removed;
  }

  resetReduceCount();
  updateReduceCount(-newReduceCount);
}

function handleClickCopy() {
  let tmpText = document.createElement("textarea");
  tmpText.value = textMonitor.innerText;
  document.body.appendChild(tmpText);
  tmpText.select();
  document.execCommand("copy");
  document.body.removeChild(tmpText);
}

function handleMouseenterChar(event) {
  idxMonitor.innerText = `위치: ${parseInt(event.target.id.substr(5)) + 1}`;
  event.target.classList.add(MOUSEENTERTEXT_CLASSNAME);
}

function handleMouseleaveChar(event) {
  idxMonitor.innerText = "";
  event.target.classList.remove(MOUSEENTERTEXT_CLASSNAME);
}

init();
