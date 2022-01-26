'use strict'

const MINE = '💣';
const FLAG = '🚩';


var gBoard;


var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}





function initGame() {
    console.log('hi');
    gBoard = buildBoard();
    renderBoard(gBoard)
}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                // TODO: Set mines at random locations
            }

        }
    }

    board[1][3].isMine = true;
    board[2][0].isMine = true;
    setMinesNegsCount(board);
    return board;
}

// // Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            var currCell = board[i][j];
            currCell.minesAroundCount = countNeighboursAround(board, i, j)
        }
    }
}

function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            // var cell = board[i][j];

            strHTML += `\t<td id="${i}-${j}" class="cell cell${i}-${j}" onClick= "cellClicked(this)">${board[i][j].isMine ? MINE : board[i][j].minesAroundCount}</td>\n`
        }

        strHTML += `</tr>\n`
    }
    // console.log(strHTML)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {


}

// function cellMarked(elCell) {

// }


// function checkGameOver() {

// }

// function expandShown(board, elCell, i, j) {

// }
