import data from '/data/loadingMsgs.js';

function showLoadingMsg() {
    const INTERVAL = 3000;
    const tipBox = document.querySelector('.short-tip');
    
    changeMsg(tipBox, data);
    setInterval(function() {changeMsg(tipBox, data)}, INTERVAL);
}

function changeMsg(msgBox, msgs) {
    let randomNum = Math.floor(Math.random() * msgs.length);
    msgBox.innerText = `[${msgs[randomNum].type}] ${msgs[randomNum].msg}`;
}

showLoadingMsg();