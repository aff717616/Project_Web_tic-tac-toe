const ref = firebase.database().ref('Game');

const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
const refScore = firebase.database().ref("score")

refScore.on("value", snapshot => {
    data = snapshot.val()
    const currentUser = firebase.auth().currentUser

    console.log(currentUser.email);
    console.log(currentUser);
    if (currentUser) {
        if (data[currentUser.uid]) {
            document.getElementById("scoreplayer").innerHTML = `(${data[currentUser.uid]})`
        }
        else {
            document.getElementById("scoreplayer").innerHTML = "(0)"
        }
    }
})

function setupUI(user) {
    if (user) {
        document.querySelector("#user-profile-name").innerHTML = user.email
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
    }
    else {
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
}


ref.on("value", snapshot => {
    getGameInfo(snapshot)
})

function getGameInfo(snapshot) {
    const currentUser = firebase.auth().currentUser

    document.getElementById('inputPlayer-x').value = ''
    document.getElementById('inputPlayer-o').value = ''

    document.querySelector('#btnJoin-x').disabled = false;
    document.querySelector('#btnJoin-o').disabled = false;

    snapshot.forEach((data) => {
        const gameInfos = data.val()
        console.log(gameInfos);
        Object.keys(gameInfos).forEach(key => {
            switch (key) {
                case 'user-x-email':
                    playerX = gameInfos[key]
                    document.getElementById('inputPlayer-x').value = playerX
                    document.querySelector('#btnJoin-x').disabled = true;
                    break
                case 'user-o-email':
                    playerO = gameInfos[key]
                    document.getElementById('inputPlayer-o').value = playerO
                    document.querySelector('#btnJoin-o').disabled = true;
                    break
            }

            if (currentUser.email == gameInfos[key]) {
                document.querySelector('#btnJoin-x').disabled = true;
                document.querySelector('#btnJoin-o').disabled = true;
            }
        })
        if (gameInfos["user-x-email"] && gameInfos["user-o-email"]) {
            document.querySelector("#btnStartGame").disabled = false
            document.querySelector("#status-text").innerHTML = "Click START GAME"
        }
        else {
            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#status-text").innerHTML = "Waiting for players..."
        }

        if (gameInfos.status === "start") {
            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => { box.addEventListener("click", Game_play) })
            final()
        }
        else if (gameInfos.status === "finish") {
            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const board = document.querySelectorAll(".table-col")
            board.forEach(gameinfo_board => { gameinfo_board.removeEventListener("click", Game_play) })

        }
        else {
            document.querySelector("#btnCancel-x").disabled = false
            document.querySelector("#btnCancel-o").disabled = false
            const boxes = document.querySelectorAll(".table-col")
            boxes.forEach(box => { box.removeEventListener("click", Game_play) })
        }
        if (gameInfos.turn) {
            document.querySelector("#status-text").innerHTML = `Turn: ${gameInfos.turn}`
        }

        if (gameInfos.tables) {
            for (const gameinfo_board in gameInfos.tables) {
                document.querySelector(`#${gameinfo_board} p`).innerHTML = gameInfos.tables[gameinfo_board]
            }
        }
        else {
            const board = document.querySelectorAll(".table-col p")
            board.forEach(gameinfo_board => { gameinfo_board.innerHTML = "" })
        }

        if (gameInfos.winner == "draw") {
            document.querySelector("#status-text").innerHTML = `GAME DRAWE`
        }
        else if (gameInfos.winner) {
            document.querySelector("#status-text").innerHTML = `Winner: ${gameInfos.winner}`
        }
    });
}

const btnJoins = document.querySelectorAll(".btn-join")
btnJoins.forEach(btnJoin => btnJoin.addEventListener('click', joinGame))

function joinGame(event) {
    const currentUser = firebase.auth().currentUser
    console.log("[Join] Current user:", currentUser);
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute("id")
        const player = btnJoinID[btnJoinID.length - 1]
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == "") {
            let tmpID = `user-${player}-id`
            let tmpEmail = `user-${player}-email`
            ref.child('game-1').update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email
            })
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;
        }
    }
}

const btnCancels = document.querySelectorAll(".btn-cancel-join-game");
btnCancels.forEach(btnCancel => { btnCancel.addEventListener('click', cancel_join) })

function cancel_join(event) {
    const currentUser = firebase.auth().currentUser;
    console.log('[Cancel] Current user:', currentUser);
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute("id");
        const player = btnCancelID[btnCancelID.length - 1];
        const playerForm = document.getElementById(`inputPlayer-${player}`)
        console.log(playerForm);
        if (playerForm.value && playerForm.value === currentUser.email) {
            let tmpID = `user-${player}-id`
            let tmpEmail = `user-${player}-email`
            ref.child('game-1').child(tmpID).remove()
            ref.child('game-1').child(tmpEmail).remove()
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false
        }
    }
}

const btnStartGame = document.querySelector("#btnStartGame");
const btnTerminateGame = document.querySelector("#btnTerminateGame");
btnStartGame.addEventListener("click", startgame);
btnTerminateGame.addEventListener("click", stopgame);

function startgame(event) {
    ref.child("game-1").update({
        status: "start",
        turn: "X",
        tables: ""
    })
}
function stopgame(event) {
    ref.child("game-1").child("status").remove()
    ref.child("game-1").child("turn").remove()
    ref.child("game-1").child("tables").remove()
    ref.child("game-1").child("winner").remove()
}

// add condition connect 4
function Game_play(event) {
    ref.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        id = event.currentTarget.id
        let rowCurrent = id.charAt(4)
        let colCurrent = id.charAt(10)
        console.log(`row`+rowCurrent)
        console.log(`col`+colCurrent)
        let col5full = 6
        //row5-col4
        if (rowCurrent == '5' && colCurrent == '5' && col5full == 6){
            col5full = 5;
        }else if (rowCurrent == '4' && colCurrent == '5' && col5full == 5){
            col5full = 4;
        }else if (rowCurrent == '3' && colCurrent == '5' && col5full == 4){
            col5full = 3;
        }else if (rowCurrent == '2' && colCurrent == '5' && col5full == 3){
            col5full = 2;
        }else if (rowCurrent == '1' && colCurrent == '5' && col5full == 2){
            col5full = 1;
        }
        if (data.turn === "X" && data["user-x-email"] === currentUser.email && !data["tables"][id]) {
            
            ref.child("game-1").child("tables").update({
                [id]: data.turn
            })
            ref.child("game-1").update({
                turn: "O"
            })
        }
        else if (data.turn === "O" && data["user-o-email"] === currentUser.email && !data["tables"][id]) {
            ref.child("game-1").child("tables").update({
                [id]: data.turn
            })
            ref.child("game-1").update({
                turn: "X"
            })
        }
    })
}

function final() {
    ref.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        turns = ["X", "O"]

        if (data.winner) {
            return
        }

        for (const turn of turns) {
            num1 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-1-col-2"] == turn && data["tables"]["row-1-col-3"] == turn
            num2 = data["tables"]["row-2-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-2-col-3"] == turn
            num3 = data["tables"]["row-3-col-1"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-3-col-3"] == turn
            num4 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-1"] == turn && data["tables"]["row-3-col-1"] == turn
            num5 = data["tables"]["row-1-col-2"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-2"] == turn
            num6 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-3"] == turn
            num7 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-3"] == turn
            num8 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-1"] == turn

            if (num1 || num2 || num3 || num4 || num5 || num6 || num7 || num8) {
                ref.child("game-1").update({
                    status: "finish",
                    winner: turn
                })
                id = data[`user-${turn.toLowerCase()}-id`]
                refScore.once("value", snapshot => {
                    scores = snapshot.val()
                    if (!scores || !scores[id]) {
                        refScore.update({
                            [id]: 3
                        })
                    }
                    else {
                        score = scores[id]
                        refScore.update({
                            [id]: parseInt(score) + 3
                        })
                    }
                })
                return
            }
            if (data["tables"]["row-1-col-1"] && data["tables"]["row-1-col-2"] && data["tables"]["row-1-col-3"] && data["tables"]["row-2-col-1"] && data["tables"]["row-2-col-2"] && data["tables"]["row-3-col-1"] && data["tables"]["row-3-col-2"] && data["tables"]["row-3-col-3"]) {
                ref.child("game-1").update({
                    status: "finish",
                    winner: "draw"
                })
                id1 = data[`user-x-id`]
                id2 = data[`user-o-id`]
                refScore.once("value", snapshot => {
                    scores = snapshot.val()
                    if (!scores || !scores[id1]) {
                        refScore.update({
                            [id1]: 1
                        })
                    }
                    else {
                        score = scores[id1]
                        refScore.update({
                            [id1]: parseInt(score) + 1
                        })
                    }
                    if (!scores || !scores[id2]) {
                        refScore.update({
                            [id2]: 1
                        })
                    }
                    else {
                        score = scores[id2]
                        refScore.update({
                            [id2]: parseInt(score) + 1
                        })
                    }
                    return
                })
            }
        }
    })
}
