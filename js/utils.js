'use strict'

function getCellPos(id) {
    var pos = {};
    var spread = id.split('-');
    pos.i = +spread[0]
    pos.j = +spread[1]
    return pos;
}


function getRandomCellPos(board) {
    return {
        i: getRandomInt(0, board.length - 1),
        j: getRandomInt(0, board.length - 1)
    }
}

//Inclusive
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            board[i][j].minesAroundCount++
        }
    }
}

//TIMER **
function startTimer() {
    gMinutesLabel = document.getElementById("minutes");
    gSecondsLabel = document.getElementById("seconds");
    gTotalSeconds = 0;
    gTimerInterval = setInterval(setTime, 1000);
}

function setTime() {
    ++gTotalSeconds;
    gSecondsLabel.innerHTML = pad(gTotalSeconds % 60);
    gMinutesLabel.innerHTML = pad(parseInt(gTotalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
//TIMER /**

// function renderRevealCells(elCell, board??) {
//     var cell = board[i][j];
//     if (cell.isMine) {
//         elCell.innerText = MINE;
//     } else if (!cell.minesAroundCount) {//===0
//         elCell.innerText = '';
//     } else if (cell.isMarked && !cell.isMine) {
//         elCell.innerText = '❌';
//     } else if (cell.minesAroundCount) {
//         elCell.innerText = `${cell.minesAroundCount}`;
//     }
//     elCell.style.backgroundColor = '#b3cfc8';
// }



