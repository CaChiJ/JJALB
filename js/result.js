const textMonitor = document.querySelector('.text-monitor');
const analysisBox = document.querySelector('.suggestion-box');

function init() {
    let analysis = JSON.parse(localStorage.getItem('analysis'));
    let originalText = JSON.parse(localStorage.getItem('original_text'));

    textMonitor.innerText = originalText;

    if(analysis.length === 0) {
        // 분석 결과가 비었음을 알려주는 문구 추가
        return;
    }

    for(let i = 0; i < analysis.length; ++i) {
        let now = analysis[i];
        const block = makeAnalysisBlock(now.start_idx, now.prior_str, now.new_str, now.removed);
        analysisBox.appendChild(block);
    }
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

init();