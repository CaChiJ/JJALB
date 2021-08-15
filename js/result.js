const textMonitor = document.querySelector('.text-monitor');
const analysisBox = document.querySelector('.suggestion-box');

const resetBtn = document.querySelector('.reset-btn');

const analysis = JSON.parse(localStorage.getItem('analysis'));
const originalText = JSON.parse(localStorage.getItem('original_text'));

const SELECTED_CLASSNAME = 'selected';

function init() {
    textMonitor.innerText = originalText;

    if (analysis.length === 0) {
        // 분석 결과가 비었음을 알려주는 문구 추가
        return;
    }

    for (let i = 0; i < analysis.length; ++i) {
        let now = analysis[i];
        const block = makeAnalysisBlock(now.start_idx, now.prior_str, now.new_str, now.removed);
        block.id = `suggestion-${i}`;
        block.addEventListener('click', handleClickSuggestion);
        analysisBox.appendChild(block);
    }

    resetBtn.addEventListener('click', handleClickReset);
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

    eStartIdx.innerText = start_idx;
    ePriorStr.innerText = prior_str;
    eNewStr.innerText = new_str;
    eRemoved.innerText = removed;

    eBlock.appendChild(eStartIdx);
    eBlock.appendChild(ePriorStr);
    eBlock.appendChild(eNewStr);
    eBlock.appendChild(eRemoved);

    return eBlock;
}


function removeAnalysisBlock(idx) {
    analysisBox.removeChild(document.querySelector(`.suggestion-box #suggestion-${idx}`));
}


function handleClickSuggestion(event) {
    let block;

    if (event.target.classList.contains('suggestion')) {
        block = event.target;
    } else {
        block = event.target.parentElement;
    }

    if (block.classList.contains(SELECTED_CLASSNAME)) {
        block.classList.remove(SELECTED_CLASSNAME);
    } else {
        block.classList.add(SELECTED_CLASSNAME);
    }
    //if(block.classList)
}


function handleClickReset() {
    if(confirm("현재 변경사항을 모두 초기 상태로 되돌리시겠습니까?")) {
        textMonitor.innerText = originalText;
        const suggestions = analysisBox.querySelectorAll('.suggestion');

        for(let i = 0; i < suggestions.length; ++i) {
            suggestions[i].classList.remove(SELECTED_CLASSNAME);
        }
    }
}


init();