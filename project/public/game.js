const ref = firebase.database().ref("Game");
const refScore = firebase.database().ref("Scores")

// refScore.on("value", snapshot => {
//     data = snapshot.val()
//     const currentUser = firebase.auth().currentUser

//     console.log(currentUser.email);
//     console.log(currentUser);
//     if (currentUser){
//         if (data[currentUser.uid]){
//             document.getElementById("scoreplayer").innerHTML = `(${data[currentUser.uid]})`
//         }
//         else{
//             document.getElementById("scoreplayer").innerHTML = "(0)"
//         }
//     }
// })
let turn = 1;
const btnJoins = document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoin) => btnJoin.addEventListener("click", joinGame));


function playgame(event) {
    console.log('hello');
}
//JOIN GAME IN BUTTON//
function joinGame(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Join] Current user:", currentUser);
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute("id");
        const player = btnJoinID[btnJoinID.length - 1];

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == "") {
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            ref.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
            });
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;
        }
    }
}

// const logo = document.querySelectorAll('.');
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
// const container1 = document.querySelectorAll('.content-1');
function setupUI(user) {
    if (user) {
        document.getElementById("user-profile-name").innerHTML = user.email;
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
        // container1.forEach(item => item.style.display = 'flex');
    } else {
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
        // container1.forEach(item => item.style.display = 'none');
    }
}

ref.on("value", (snapshot) => {
    getGameInfo(snapshot);
});
const btnstart = document.getElementById("btnStartGame");
const btnstop = document.getElementById("btnTerminateGame");
//btnstop.disabled = true;//
// btnstart.addEventListener("click", startgame);
// btnstop.addEventListener("click", stopgame);
const btn11 = document.getElementById("row-1-col-1");
const btn12 = document.getElementById("row-1-col-2");
const btn13 = document.getElementById("row-1-col-3");
const btn21 = document.getElementById("row-2-col-1");
const btn22 = document.getElementById("row-2-col-2");
const btn23 = document.getElementById("row-2-col-3");
const btn31 = document.getElementById("row-3-col-1");
const btn32 = document.getElementById("row-3-col-2");
const btn33 = document.getElementById("row-3-col-3");
let isstart = 0;
/*btn11.addEventListener("click", ()=>{
    if(isstart == 1){
        console.log('row-1-col-1');
        console.log(btn11.innerHTML);
        if (document.innerHTML ==""){
            document.getElementById('row-1-col-1').innerHTML = '0';
            turn++;
        }else if(btn11.innerHTML =="" && turn%2==0){
            document.getElementById('row-1-col-1').innerHTML = 'x';
            turn++;
        }else{
            console.log('avavava');
        }
        
    }
})*/
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

function getGameInfo(snapshot) {
    document.getElementById("inputPlayer-x").value = "";
    document.getElementById("inputPlayer-o").value = "";

    document.querySelector('#btnJoin-x').disabled = false;
    document.querySelector('#btnJoin-o').disabled = false;

    document.querySelector("#status-text").innerHTML = "Waiting for players..."

    snapshot.forEach((data) => {
        const gameInfos = data.val();
        console.log(gameInfos);
        Object.keys(gameInfos).forEach((key) => {
            switch (key) {
                case "user-x-email":
                    playerx = gameInfos[key];
                    document.getElementById("inputPlayer-x").value = gameInfos[key];
                    document.querySelector("#btnJoin-x").disabled = true;

                    break;
                case "user-o-email":
                    playero = gameInfos[key];
                    document.getElementById("inputPlayer-o").value = gameInfos[key];
                    document.querySelector("#btnJoin-o").disabled = true;
                    gameInfos[key];
                    break;
            }
        });

        if (document.getElementById("inputPlayer-x").value != "" && document.getElementById("inputPlayer-o").value != "") {
            btnstart.disabled = false;
            document.querySelector("#status-text").innerHTML = "Click START GAME"
        } else {
            btnstart.disabled = true;
            document.querySelector("#status-text").innerHTML = "Waiting for players..."
        }
        if (gameInfos.status === "start") {

            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const board = document.querySelectorAll(".table-col")
            win()
            board.forEach(gameinfo_board => { gameinfo_board.addEventListener("click", playgame) })
        } else if (gameInfos.status === "finish") {
            document.querySelector("#btnStartGame").disabled = true
            document.querySelector("#btnCancel-x").disabled = true
            document.querySelector("#btnCancel-o").disabled = true
            const board = document.querySelectorAll(".table-col")
            board.forEach(gameinfo_board => { gameinfo_board.removeEventListener("click", playgame) })
        } else {
            document.querySelector("#btnCancel-x").disabled = false
            document.querySelector("#btnCancel-o").disabled = false
            const board = document.querySelectorAll(".table-col")
            board.forEach(gameinfo_board => { gameinfo_board.removeEventListener("click", playgame) })
        }
        if (gameInfos.turn) {
            document.querySelector("#status-text").innerHTML = `Turn: ${gameInfos.turn}`
        }

        if (gameInfos.tables) {
            for (const gameinfo_board in gameInfos.tables) {
                document.querySelector(`#${gameinfo_board} p`).innerHTML = gameInfos.tables[gameinfo_board]
            }
        } else {
            const board = document.querySelectorAll(".table-col p")
            board.forEach(gameinfo_board => { gameinfo_board.innerHTML = "" })
        }

        if (gameInfos.winner == "draw") {
            document.querySelector("#status-text").innerHTML = `GAME DRAW`
        } else if (gameInfos.winner) {
            document.querySelector("#status-text").innerHTML = `Winner: ${gameInfos.winner}`
        }
    });
}


const btnCancels = document.querySelectorAll(".btn-cancel-join-game");
btnCancels.forEach((btnCancel) =>
    btnCancel.addEventListener('click', canceljoin)
);

function canceljoin(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Cancel] Current user:", currentUser);
    if (currentUser) {
        const btnCanceID = event.currentTarget.getAttribute("id");
        const player = btnCanceID[btnCanceID.length - 1];
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email) {
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            ref.child("game-1").child(tmpID).remove();
            ref.child("game-1").child(tmpEmail).remove();
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }

    }
}

function playgame(event) {
    ref.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        id = event.currentTarget.id
        if (data.turn === "X" && data["user-x-email"] === currentUser.email && !data["tables"][id]) {
            ref.child("game-1").child("tables").update({
                [id]: data.turn
            })
            ref.child("game-1").update({
                turn: "O"
            })
        } else if (data.turn === "O" && data["user-o-email"] === currentUser.email && !data["tables"][id]) {
            ref.child("game-1").child("tables").update({
                [id]: data.turn
            })
            ref.child("game-1").update({
                turn: "X"
            })
        }
    })
}

function win() {
    ref.child("game-1").once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        turns = ["X", "O"]

        if (data.winner) {
            return
        }

        for (const turn of turns) {
            win1 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-1-col-2"] == turn && data["tables"]["row-1-col-3"] == turn
            win2 = data["tables"]["row-2-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-2-col-3"] == turn
            win3 = data["tables"]["row-3-col-1"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-3-col-3"] == turn
            win4 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-1"] == turn && data["tables"]["row-3-col-1"] == turn
            win5 = data["tables"]["row-1-col-2"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-2"] == turn
            win6 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-3"] == turn
            win7 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-3"] == turn
            win8 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-1"] == turn

            if (win1 || win2 || win3 || win4 || win5 || win6 || win7 || win8) {
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
                    } else {
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
                    } else {
                        score = scores[id1]
                        refScore.update({
                            [id1]: parseInt(score) + 1
                        })
                    }
                    if (!scores || !scores[id2]) {
                        refScore.update({
                            [id2]: 1
                        })
                    } else {
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