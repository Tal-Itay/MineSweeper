'use strict'

//neighbours loop  
function countNeighboursAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count;
}

function getCellPos(id) {
    var pos = {};
    var spread = id.split('-');
    pos.i = +spread[0]
    pos.j = +spread[1]
    return pos;
}


// function renderCell(location, value) {
//     var cellSelector = '.' + getClassName(location);
//     var elCell = document.querySelector(cellSelector);
//     elCell.innerHTML = value;
// }


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




// function showTimer() {
//     var currTime = (Date.now() - gTimerStart) / 1000;  //טיימר שמראה 3 ספרות אחרי הנקודה
//     var elTimer = document.querySelector('.timer');
//     elTimer.style.display = 'block';
//     elTimer.innerText = `Timer: ${currTime}`;
//     elTimer.style.cololr = 'black';
// }

// function startTimer() {
//     gTimerStart = Date.now();
//     gGameInterval = setInterval(showTimer, 1);
// }