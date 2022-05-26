'use strict'

const MINE = '💣'
const FLAG = '🚩'
const GAME_EMOJI = '🤨'
const WIN_EMOJI = '🤩'
const LOSE_EMOJI = '😵'

var gBoard

var gLevel = {
  size: 4,
  mines: 2,
  lives: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
}

const BEGINNER = {
  size: 4,
  mines: 2,
  lives: 2,
}
const MEDIUM = {
  size: 8,
  mines: 12,
  lives: 3,
}
const EXPERT = {
  size: 12,
  mines: 30,
  lives: 3,
}

var gLives = gLevel.lives
var gMinesCountDown = gLevel.mines
var gHint = 3
var gIsFirstClick = true

//Timer:
var gTimerInterval
var gMinutesLabel
var gSecondsLabel
var gTotalSeconds

function initGame() {
  // console.log('hi');
  gBoard = buildBoard()
  gMinesCountDown = gLevel.mines
  renderBoard(gBoard)
  gGame.isOn = true
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gIsFirstClick = true
  gLives = gLevel.lives
  gHint = 3

  var elTimer = document.querySelector('.timer')
  clearInterval(gTimerInterval)
  elTimer.innerHTML = '<label id="minutes">00</label>:<label id="seconds">00</label>'
  //hide modal
  var elEndGameModal = document.querySelector('.game-over-modal h2')
  elEndGameModal.classList.add('hide')

  //putting lives back
  var elLive = document.querySelector(`.lives`)
  var livesHtmlStr = ''
  for (var i = 0; i < gLevel.lives; i++) {
    livesHtmlStr += `<span class="live${i + 1}">❤️</span>`
  }
  elLive.innerHTML = livesHtmlStr

  //safe click back
  for (var i = 0; i < 3; i++) {
    var elSafeClick = document.querySelector(`.safe${i + 1}`)
    elSafeClick.classList.remove('hide')
  }

  //cell color back
  document.querySelector('.board').style.backgroundColor = '#768d87'
  //background pic back
  document.querySelector('body').style.backgroundImage = `url("../assets/images/background3.jpeg")`
}

function buildBoard() {
  var board = []
  for (var i = 0; i < gLevel.size; i++) {
    board.push([])
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  // console.log(board);
  return board
}

function renderBoard(board) {
  document.querySelector('.mines-count span').innerText = gMinesCountDown //updates the mines left
  var strHTML = ''

  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`
    for (var j = 0; j < board[0].length; j++) {
      strHTML += `\t<td id="${i}-${j}" class="cell cell${i}-${j}"  
            onmousedown="keyEvent(event, this)" oncontextmenu="event.preventDefault();"></td>\n`
    }
    strHTML += `</tr>\n`
  }
  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function setMines(board, clickedPosition) {
  for (var i = 0; i < gLevel.mines; i++) {
    var pos
    do {
      pos = getRandomCellPos(board)
    } while (board[pos.i][pos.j].isMine || (pos.i === clickedPosition.i && pos.j === clickedPosition.j))

    board[pos.i][pos.j].isMine = true
    setMinesNegsCount(board, pos.i, pos.j)
  }
}

function keyEvent(event, elCell) {
  var cellIdx = getCellPos(elCell.id)
  var i = cellIdx.i
  var j = cellIdx.j
  var cell = gBoard[i][j]
  if (!gGame.isOn) return
  if (cell.isShown) return

  if (gIsFirstClick) firstClick(cellIdx)

  var mouseBtn = event.which
  if (mouseBtn === 1) {
    //left
    cellClicked(elCell)
  } else if (mouseBtn === 3) {
    //right
    cellMarked(elCell)
  }
}

function firstClick(clickedPosition) {
  setMines(gBoard, clickedPosition)
  startTimer()
  gIsFirstClick = false
}

function cellClicked(elCell) {
  var cellIdx = getCellPos(elCell.id)
  var i = cellIdx.i
  var j = cellIdx.j
  var cell = gBoard[i][j]

  if (gLives > 0 && !cell.isMarked) {
    //update model:
    cell.isShown = true
    gGame.shownCount++

    // if stepped on mine:
    if (cell.isMine) {
      elCell.innerText = MINE
      var elLive = document.querySelector(`.live${gLives}`)
      elLive.classList.add('hide')
      gLives--
      gMinesCountDown--

      document.querySelector('.mines-count span').innerText = gMinesCountDown
      elCell.style.backgroundColor = '#b3cfc8'

      if (gLives === 0) gameOver(false)

      //if not a mine and zero mines around:
    } else if (!cell.minesAroundCount) {
      expandShown(gBoard, i, j)
      if (cell.minesAroundCount === 0) elCell.innerText = ''
      //if not a mine but mines around:
      else elCell.innerText = `${cell.minesAroundCount}`
      elCell.style.backgroundColor = '#b3cfc8'
    } else {
      //
      if (cell.minesAroundCount === 0) elCell.innerText = ''
      elCell.innerText = `${cell.minesAroundCount}`
      elCell.style.backgroundColor = '#b3cfc8'
    }
  }
  checkWin()
}

function cellMarked(elCell) {
  var cellIdx = getCellPos(elCell.id)
  var i = cellIdx.i
  var j = cellIdx.j
  var cell = gBoard[i][j]

  if (cell.isShown) return

  if (!cell.isMarked) {
    //model:
    cell.isMarked = true
    gGame.markedCount++
    if (gMinesCountDown > 0) gMinesCountDown--

    // dom:
    elCell.innerText = FLAG
    document.querySelector('.mines-count span').innerText = gMinesCountDown
  } else {
    //model:
    cell.isMarked = false
    gGame.markedCount--
    gMinesCountDown++
    // dom:
    elCell.innerText = ''
    document.querySelector('.mines-count span').innerText = gMinesCountDown
  }
  checkWin()
}

function expandShown(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === rowIdx && j === colIdx) continue

      var currCell = board[i][j]
      if (currCell.isMine || currCell.isMarked || currCell.isShown) continue
      //model:
      if (!gBoard[i][j].isShown) gGame.shownCount++
      currCell.isShown = true

      //dom:
      var elCell = document.getElementById(`${i}-${j}`)
      if (currCell.isMine) {
        elCell.innerText = MINE
      } else if (currCell.minesAroundCount === 0) {
        elCell.innerText = ''
      } else if (currCell.minesAroundCount > 0) {
        elCell.innerText = `${currCell.minesAroundCount}`
      }
      elCell.style.backgroundColor = '#b3cfc8'
      if (currCell.minesAroundCount === 0) expandShown(gBoard, i, j)
    }
  }
}

function checkWin() {
  var mineAmount = gLevel.mines
  var remainingMines = mineAmount - (gLevel.lives - gLives)

  if (gGame.markedCount === remainingMines && gGame.shownCount === gLevel.size ** 2 - remainingMines) {
    gameOver(true)
  }
}

function gameOver(isWin) {
  gGame.isOn = false
  clearInterval(gTimerInterval)
  gTimerInterval = null
  var elEndGameModal = document.querySelector('.game-over-modal h2')
  var elRestartBtn = document.querySelector('.restart-btn')

  //if won:
  if (isWin) {
    elEndGameModal.innerText = "Great Job! You're Still Alive! "
    elRestartBtn.innerText = WIN_EMOJI
    elEndGameModal.classList.remove('hide')

    //if lost:
  } else if (!isWin) {
    elEndGameModal.innerText = 'Game Over!'
    elRestartBtn.innerText = LOSE_EMOJI
    gGame.isOn = false
    elEndGameModal.classList.remove('hide')

    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        var currCell = gBoard[i][j]
        var elCell = document.getElementById(`${i}-${j}`)
        if (currCell.isMine) {
          elCell.innerText = MINE
        } else if (currCell.minesAroundCount === 0) {
          elCell.innerText = ''
        } else if (currCell.isMarked && !currCell.isMine) {
          elCell.innerText = '❌'
        } else if (currCell.minesAroundCount) {
          elCell.innerText = `${currCell.minesAroundCount}`
        }
        elCell.style.backgroundColor = '#b3cfc8'
      }
    }
    document.querySelector('body').style.backgroundImage = `url("../assets/images/burned4.jpeg")`
  }
}

function restartGame() {
  var elGameEmoji = document.querySelector('.restart-btn')
  elGameEmoji.innerText = GAME_EMOJI
  var elEndGameModal = document.querySelector('.game-over-modal h2')
  elEndGameModal.classList.add('hide')

  initGame()
}

function gameLevel(elLevelBtn) {
  switch (elLevelBtn.innerText) {
    case 'Beginner':
      gLevel = BEGINNER
      break

    case 'Medium':
      gLevel = MEDIUM
      break

    case 'Expert':
      gLevel = EXPERT
      break
  }
  restartGame(elLevelBtn)
}

function safeClick(elbtn) {
  var emptyCells = []
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
        var emptyCell = { i: i, j: j }
        emptyCells.push(emptyCell)
      }
    }
  }

  var randomEmptyCell = emptyCells[getRandomInt(0, emptyCells.length - 1)]
  var elRandEmptyCell = document.getElementById(`${randomEmptyCell.i}-${randomEmptyCell.j}`)
  elRandEmptyCell.style.backgroundColor = '#ac8a61'
  elbtn.classList.add('hide')
}
