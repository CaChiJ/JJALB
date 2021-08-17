const textMonitor = document.querySelector('.text-monitor');
const analysisBox = document.querySelector('.suggestion-box');

const resetBtn = document.querySelector('.reset-btn');
const copyBtn = document.querySelector('.copy-btn');

const analysis = JSON.parse(localStorage.getItem('analysis'));
const originalText = JSON.parse(localStorage.getItem('original_text'));

const SELECTED_CLASSNAME = 'selected';
const REPLACED_CLASSNAME = 'replaced';


function init() {
    setTextMonitor(originalText);

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
    copyBtn.addEventListener('click', handleClickCopy);
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


function setTextMonitor(str) {
    while(textMonitor.firstChild) {
        textMonitor.firstChild.remove();
    }

    for(let i = 0; i < str.length; ++i) {
        let newChar = document.createElement('span');
        newChar.innerText = str[i];
        newChar.id = `text-${i}`
        textMonitor.appendChild(newChar);
    }
}


function handleClickSuggestion(event) {
    let block;  // 클릭된 suggestion 블럭

    if (event.target.classList.contains('suggestion')) {
        block = event.target;
    } else {
        block = event.target.parentElement;
    }

    let blockNum = block.id.substr(11);

    if (block.classList.contains(SELECTED_CLASSNAME)) {
        // 분석 해제
        block.classList.remove(SELECTED_CLASSNAME);
        updateText(blockNum, false);
    } else {
        // 분석 적용
        block.classList.add(SELECTED_CLASSNAME);
        updateText(blockNum, true);
    }
}


function updateText(anaylsisNum, status) {
    const selectedText = document.getElementById(`text-${analysis[anaylsisNum].start_idx}`);
    let isReplaced = selectedText.classList.contains(REPLACED_CLASSNAME);

    if(status && isReplaced || !status && !isReplaced) {
        return;
    }

    if(status) {
        for(let i = 0; i < analysis[anaylsisNum].prior_str.length; ++i) {
            document.getElementById(`text-${analysis[anaylsisNum].start_idx + i}`).remove();
        }
        
        let newStr = document.createElement('span');
        newStr.id = `text-${analysis[anaylsisNum].start_idx}`;
        newStr.classList.add(REPLACED_CLASSNAME);
        newStr.innerText = analysis[anaylsisNum].new_str;
        textMonitor.insertBefore(newStr, document.getElementById(`text-${analysis[anaylsisNum].start_idx + analysis[anaylsisNum].prior_str.length}`));
    } else {
        document.getElementById(`text-${analysis[anaylsisNum].start_idx}`).remove();

        for(let i = 0; i < analysis[anaylsisNum].prior_str.length; ++i) {
            let newStr = document.createElement('span');
            newStr.id = `text-${analysis[anaylsisNum].start_idx + i}`;
            newStr.innerText = analysis[anaylsisNum].prior_str[i];
            textMonitor.insertBefore(newStr, document.getElementById(`text-${analysis[anaylsisNum].start_idx + analysis[anaylsisNum].prior_str.length}`));
        }
    }
}


function handleClickReset() {
    if(confirm("현재 변경사항을 모두 초기 상태로 되돌리시겠습니까?")) {
        setTextMonitor(originalText);
        const suggestions = analysisBox.querySelectorAll('.suggestion');

        for(let i = 0; i < suggestions.length; ++i) {
            suggestions[i].classList.remove(SELECTED_CLASSNAME);
        }
    }
}


function handleClickSelectAll() {

}


function handleClickCopy() {
    let tmpText = document.createElement('textarea');
    tmpText.value = textMonitor.innerText;
    document.body.appendChild(tmpText);
    tmpText.select();
    document.execCommand('copy');
    document.body.removeChild(tmpText);
}


init();