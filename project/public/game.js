let board = document.querySelector(".board")
let player = document.querySelector(".player")
let playAgain = document.querySelector(".playAgain")
let restart = document.querySelector(".restart")
let winner = document.getElementById("currentPlayer_status")
let box = 0
let winningArray = [
    [0, 1, 2],
    [5, 6, 7],
    [10, 11, 12],
    [15, 16, 17],
    [20, 21, 22],
    [4, 3, 2],
    [9, 8, 7],
    [14, 13, 12],
    [19, 18, 17],
    [24, 23, 22],
    [1, 2, 3],
    [6, 7, 8],
    [11, 12, 13],
    [16, 17, 18],
    [21, 22, 23],
    [0, 5, 10],
    [1, 6, 11],
    [2, 7, 12],
    [3, 8, 13],
    [4, 9, 14],
    [20, 15, 10],
    [21, 16, 11],
    [22, 17, 12],
    [23, 18, 13],
    [24, 19, 14],
    [5, 10, 15],
    [6, 11, 16],
    [7, 12, 17],
    [8, 13, 18],
    [9, 14, 19],
    [2, 6, 10],
    [8, 12, 16],
    [14, 18, 22],
    [22, 16, 10],
    [18, 12, 6],
    [14, 8, 2],
    [1, 7, 13],
    [19, 13, 7],
    [5, 11, 17],
    [3, 7, 11],
    [23, 17, 11],
    [15, 11, 17],
    [21, 17, 13],
    [9, 13, 17]
];
let currentPlayer = 1
document.addEventListener("DOMContentLoaded", loadDOM)
    //load dom function

function loadDOM() {
    createBoard()
    player.innerHTML = currentPlayer
    playAgain.addEventListener("click", reset)
    let squares = document.querySelectorAll(".board div")
    Array.from(squares).forEach(square => {
        square.addEventListener("click", clickBox)

    })
}
// createBoard function

function createBoard() {

    winner.innerHTML = `The current player is`
    for (let i = 0; i < 30; i++) {
        let div = document.createElement("div")
        div.setAttribute("data-id", i)
        div.className = "square"
        if (i >= 25) {
            div.className = "taken"
        }
        board.appendChild(div)
    }
}
//clickBoard function
let counttie = 0;

function clickBox() {
    let squares = document.querySelectorAll(".board div")
    let click = parseInt(this.dataset.id)
    if (squares[click + 5].classList.contains("taken") && !squares[click].classList.contains("taken")) {
        if (currentPlayer === 1) {
            currentPlayer = 2
            this.className = "player-one taken"
            counttie++;
            player.innerHTML = currentPlayer
            checkWon()

            console.log(player)
        } else if (currentPlayer === 2) {
            currentPlayer = 1
            this.className = "player-two taken"
            counttie++;
            player.innerHTML = currentPlayer
            checkWon()
            console.log(player)
        }
        if (box === 20) {
            setTimeout(() => alert("boxes filled"), 300)
            setTimeout(() => restart.style.display = "flex", 500)
        }
    } else {
        alert("กรุณาหยอดช่องที่ล่างสุดของแถวที่ว่างอยู่")
    }
}
//the checkWon function
function checkWon() {
    let squares = document.querySelectorAll(".board div")

    for (let y = 0; y < winningArray.length; y++) {

        let square = winningArray[y]
        if (square.every(q => squares[q].classList.contains("player-one"))) {
            counttie = 0;
            player.innerHTML = 1
                // setTimeout(() => alert("player one(red) wins "), 200)
            setTimeout(() => restart.style.display = "flex", 500)
            winner.innerHTML = `THE WINNER IS PLAYER `
            currentPlayer = 1
            break
        } else if (square.every(q => squares[q].classList.contains("player-two"))) {
            counttie = 0;
            player.innerHTML = 2
                // setTimeout(() => alert("player two(yellow) wins"), 200)
            setTimeout(() => restart.style.display = "flex", 500)
            winner.innerHTML = 'THE WINNER IS PLAYER '
            currentPlayer = 1

        } else if (counttie == 25) {
            counttie = 0;
            player.innerHTML = ''
            winner.innerHTML = 'GAME DRAW '
            setTimeout(() => restart.style.display = "flex", 500)
            currentPlayer = 1
            break

        }
    }

}

function reset() {

    board.innerHTML = ""
    loadDOM()
    restart.style.display = "none"
}