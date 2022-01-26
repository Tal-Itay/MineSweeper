'use strict'

const MINE = '💣';
const FLAG = '🚩';


var gBoard;
var gPreviousBord;
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
var gLives = 3;
var gFirstClick = true;
var gTimerStart;
var gGameInterval;

function initGame() {
    console.log('hi');
    gBoard = buildBoard();
    renderBoard(gBoard)
    gFirstClick = true;
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
                // TODO: Set mines at random locations - see where
            }

        }
    }

    board[1][3].isMine = true;
    board[2][0].isMine = true;
    setMinesNegsCount(board);
    console.log(board);
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

            strHTML += `\t<td id="${i}-${j}" class="cell cell${i}-${j}" onClick= "cellClicked(this)"></td>\n`
            //${board[i][j].isMine ? MINE : board[i][j].minesAroundCount}
        }

        strHTML += `</tr>\n`
    }
    // console.log(strHTML)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function cellClicked(elCell) { //elCell is an html element (no model js data)
    console.log(elCell);
    if (gFirstClick) {
        gGame.isOn = true;
        // startTimer();
        gFirstClick = false
    }


    // if (elCell.isMarked);
    var cellIdx = getCellPos(elCell.id)
    var i = cellIdx.i
    var j = cellIdx.j
    var cell = gBoard[i][j]


    // gPreviousBord = gBoard.slice(0, gBoard.length);

    if (!cell.isShown && !cell.isMarked) { //
        if (gLives > 0) {
            //update model:
            gGame.shownCount++
            gBoard.isShown = true;
            // var numOfMines = setMinesNegsCount(elCell)
            // cell.minesAroundCount = numOfMines

            // update dom:
            if (cell.isMine) {
                elCell.innerText = MINE;
                gLives--
                if (gLives === 0) {
                    gmaOver();
                }
            } else if (!cell.minesAroundCount) {
                expandShown()
            } else {
                elCell.innerText = `${cell.minesAroundCount}`;
            }
        } else {
            elCell.innerText = MINE
            gameOver()
        }
    }
    // checkWin();

}


// function cellMarked(elCell) {

// }


// function checkGameOver() {

// }

function gameOver() {
    clearInterval(gGameInterval);
    gGameInterval = null;
    gGame.isOn = false;
}

// function expandShown(board, elCell, i, j) {

// }

// function checkWin() {

// }