class Analysis {
    constructor(startIdx, prior_str, new_str, removed, abb_type) {
        this.startIdx = startIdx;
        this.prior_str = prior_str;
        this.new_str = new_str;
        this.removed = removed;
        this.abb_type = abb_type;
    }
}

const RESULT_PAGE = "/html/result.html";

const REMOVED_SPACE = '_';

const replaceTable = [
    ['하여', '해', 1],
    ['하였', '했', 1],
    ['되어', '돼', 1],
    ['되었', '됐', 1],
    ['었었', '었', 1],
    ['했었', '했', 1],
    ['보았', '봤', 1],
    ['주었', '줬', 1],
    [' 매우 ', REMOVED_SPACE, 3],
    [' 아주 ', REMOVED_SPACE, 3],
    [' 굉장히 ', REMOVED_SPACE, 3],
    [' 정말 ', REMOVED_SPACE, 3],
    [' 약간 ', REMOVED_SPACE, 3],
    [' 결코 ', REMOVED_SPACE, 3],
    [' 조금 ', REMOVED_SPACE, 3],
    ['다는 것', '(으)ㅁ', 3],
    ['와 같은 ', ' 같은 ', 1],
    ['와 같이', ' 같이 ', 1],
    ['게 되었', '었/였/았', 3],
    ['게 됐', '었/였/았', 2]
    [' 수많은 ', ' 많은 ', 1]
];


function setPercentage(percentage) {
    const progressBox = document.querySelector('.progress');
    progressBox.innerText = `${percentage}%`;
}


function saveInput() {
    let writingArea = document.querySelector('.input-box .writing-area');
    localStorage.setItem("original_text", JSON.stringify(writingArea.value));
}


function analyize() {
    let originalText = JSON.parse(localStorage.getItem("original_text"));

    let passCount = 0;
    let result = [];

    for (let idx = 0; idx < originalText.length; ++idx) {
        setPercentage(Math.round((idx+1) / originalText.length * 100));

        if (passCount > 0) {
            passCount--;
            continue;
        }

        for (let rep = 0; rep < replaceTable.length; ++rep) {
            if (idx + replaceTable[rep].length >= originalText.length) {
                continue;
            }

            let isSame = true;

            for (let i = 0; i < replaceTable[rep][0].length; ++i) {
                if (replaceTable[rep][0][i] != originalText[idx + i]) {
                    isSame = false;
                    break;
                }
            }

            if (isSame) {
                result.push(new Analysis(idx, replaceTable[rep][0], replaceTable[rep][1], replaceTable[rep][2]));
                passCount = replaceTable[rep][0].length - 1;
                break;
            }
        }
    }

    localStorage.setItem("analysis", JSON.stringify(result));
    setTimeout(function() {
        window.location.href = RESULT_PAGE;
    }, 1000);
}