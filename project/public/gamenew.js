let num = 1;
const ref = firebase.database().ref('Game');
const table = document.querySelector(`#table`);
// let rotateVal = 0;
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
const refScore = firebase.database().ref("score")
const refrotate = firebase.database().ref("rotates");
const ref_userdata = firebase.database().ref('UserData');
const user = firebase.auth().currentUser
refScore.on("value", snapshot => {
    data = snapshot.val()
    const currentUser = firebase.auth().currentUser
    console.log(currentUser);
})

if (document.querySelector('#user-profile-name').innerHTML !=''){
    goToMenuPage();
}
function setupUI(user) {
    
    if (user) {
        ref_userdata.once('value' , snapshot => {
            if(snapshot.child(user.uid).exists()){
                document.querySelector('#user-profile-name').innerHTML = user.email + " Score : " + snapshot.child(user.uid).child('Score').val() +"";
                ref_userdata.child(user.uid).update({
                    ['Name']: user.email,
                });
            }else{
                ref_userdata.child(user.uid).update({
                    ['Score']:0,
                });
                document.querySelector('#user-profile-name').innerHTML = user.email +" (0)";
                location.reload()
                location.reload()
            }
            user_uid = user.uid;
        });
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
let countwino = 0;
let countwinx = 0;
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
            console.log('key');
            console.log(key);
            switch (key) {
                case 'user-x-id':
                    
                    if (gameInfos["1 room-id"] == roomid){
                        
                        playerX = gameInfos['user-x-email']
                        console.log('keyyyyyyy');
                        console.log(key);
                        document.getElementById('inputPlayer-x').value = playerX
                        document.querySelector('#btnJoin-x').disabled = true;
                        break
                    }else{
                        break
                    }
                case 'user-o-id':
                    if (gameInfos["1 room-id"] == roomid){
                        playerO = gameInfos['user-o-email']
                        console.log('keyyyyyyy');
                        console.log(key);
                        document.getElementById('inputPlayer-o').value = playerO
                        document.querySelector('#btnJoin-o').disabled = true;
                        break
                    }else{
                        break
                    }
            }

             if (currentUser.email == gameInfos[key]) {
                 document.querySelector('#btnJoin-x').disabled = true;
                 document.querySelector('#btnJoin-o').disabled = true;
             }
        })
        if (gameInfos["user-x-email"]=='Empty' && gameInfos["user-o-email"]=='Empty') {
        }
        else if (gameInfos["user-x-email"] && gameInfos["user-o-email"]) {
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

var roomid = ''

function qjoinroom(){
    roomid = '';
        ref.once('value', snapshot => {
            snapshot.forEach( (data) => {
        
                var user_1 = data.child('user-o-email').val()
                var user_2 = data.child('user-x-email').val()
                var room = data.child('1 room-id').val()
                var player = [user_1, user_2];
                if((user_1 != 'Empty' || user_2 != 'Empty') && player.includes("Empty")){
                    roomid= room;
                    return;
                }
            });
            ref.once('value' , snapshot => {
                const gameInfos = snapshot.val();
                Object.keys(gameInfos).forEach(key => {
                                if(key == roomid){
                                    ref.once('value' , snapshot => {
                                        getGameInfo(snapshot);
                                        });
                                        var user = firebase.auth().currentUser;
                                        setupUI(user)
                                        goToGamePage()
                                        
                                }
                    });
            });
        });
        
    
    if(roomid == ''){
        alert("Room not Found");
    }else{
        alert("Join room");
        document.querySelector('#room-text').innerHTML = roomid;
        
    }
    
}
function joinroom(){
    var room_id = '';
    room_id = document.getElementById('input-room-id').value;
    
    if(room_id == ''){
        joinFeedback.style = `color:crimson`;
        joinFeedback.innerText = `Please insert Code`;
        
    }else if(room_id.length != 5){
        joinFeedback.style = `color:crimson`;
        joinFeedback.innerText = `invalid Code`;

    }else{
        roomid= room_id;
        ref.once('value' , snapshot => {
            var time = 0;
            const gameInfos = snapshot.val();
            try {
                    Object.keys(gameInfos).forEach(key => {
                            if(key == roomid){
                                ref.once('value' , snapshot => {
                                    getGameInfo(snapshot);
                                    });
                                    var user = firebase.auth().currentUser;
                                    document.querySelector('#room-text').innerHTML = roomid;
                                    setupUI(user)
                                    showcreate()
                                    joinFeedback.style = `color:green`;
                                    joinFeedback.innerText = `joined room`;
                                    time ++;
                                    throw 'Break';
                            }
                            else{
                            time ++;
                                joinFeedback.style = `color:crimson`;
                                joinFeedback.innerText = `room not found`;
                                }
                });
              } catch (e) {
                if (e !== 'Break') throw e
              }

        });
    }
    goToGamePage()
}
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
            ref.child(roomid).update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
            })
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;
        }
    }
}
function createroom(){
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   roomid=result;
  ref.once('value', snapshot => {
    snapshot.forEach( (data) => {

        var user_1 = data.child('user-o-email').val()
        var user_2 = data.child('user-x-email').val()
        var room = data.child('1 room-id').val()
        if(user_1 == 'Empty' && user_2 == 'Empty'){
           ref.child(room).remove()
        }

    });
});
   ref.once('value' , snapshot => {
        if(roomid){
            
           ref.child(roomid).update({
            ['user-o-email']: 'Empty',
            ['user-x-email']: 'Empty',
            ['1 room-id']: roomid,})
            getGameInfo(snapshot);
        }else{
    }
    });
   var user = firebase.auth().currentUser;
//    document.querySelector('#room-text').innerHTML = roomid;
    setupUI(user)
    goToGamePage()
    // showcreate()
   return result;
   
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
            ref.child(roomid).child(tmpID).remove()
            ref.child(roomid).child(tmpEmail).remove()
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false
        }
    }
    const btnCancelID = event.currentTarget.getAttribute("id");
    const player = btnCancelID[btnCancelID.length - 1];
    ref.child(roomid).update({
        [`user-${player}-email`]: 'Empty',
    });

    off()
}
let toggle = 0;
const btnStartGame = document.querySelector("#btnStartGame");
const btnTerminateGame = document.querySelector("#btnTerminateGame");
const btngotomenu = document.querySelector("#btnmenugame");
btnStartGame.addEventListener("click", startgame);
btnTerminateGame.addEventListener("click", stopgame);
btngotomenu.addEventListener("click", off());

function startgame(event) {
    if (toggle ==0){
    ref.child(roomid).update({
        status: "start",
        turn: "X",
        tables: ""
    })
    toggle = 1;
    }else if(toggle == 1){
        ref.child(roomid).update({
            status: "start",
            turn: "O",
            tables: ""
        })
        toggle = 0;
    }
}
function stopgame(event) {
    ref.child(roomid).child("status").remove()
    ref.child(roomid).child("turn").remove()
    ref.child(roomid).child("tables").remove()
    ref.child(roomid).child("winner").remove()
}
let col5full = 6
let col4full = 6
let col3full = 6
let col2full = 6
let col1full = 6

// add condition connect 4
function Game_play(event) {
    ref.child(roomid).once("value", snapshot => {
        data = snapshot.val()
        currentUser = firebase.auth().currentUser
        id = event.currentTarget.id
        let rowCurrent = id.charAt(4)
        let colCurrent = id.charAt(10)
        console.log(`row`+rowCurrent)
        console.log(`col`+colCurrent)
        let checkRow5 = document.querySelector(`#row-5-col-${colCurrent} p`).innerText
        let checkRow4 = document.querySelector(`#row-4-col-${colCurrent} p`).innerText
        let checkRow3 = document.querySelector(`#row-3-col-${colCurrent} p`).innerText
        let checkRow2 = document.querySelector(`#row-2-col-${colCurrent} p`).innerText
        let checkRow1 = document.querySelector(`#row-1-col-${colCurrent} p`).innerText
        console.log(checkRow5);
        if(checkRow5 != 'X' && checkRow5 != 'O'){
            id = `row-5-col-${colCurrent}`
        }
        else if(checkRow4 != 'X' && checkRow4 != 'O'){
            id = `row-4-col-${colCurrent}`
        }
        else if(checkRow3 != 'X' && checkRow3 != 'O'){
            id = `row-3-col-${colCurrent}`
        }
        else if(checkRow2 != 'X' && checkRow2 != 'O'){
            id = `row-2-col-${colCurrent}`
        }
        else if(checkRow1 != 'X' && checkRow1 != 'O'){
            id = `row-1-col-${colCurrent}`
        }
        console.log(checkRow5)
        if (data.turn === "X" && data["user-x-email"] === currentUser.email && !data["tables"][id]) {
            ref.child(roomid).child("tables").update({
                [id]: data.turn
                
            })
            console.log(data.turn)
            ref.child(roomid).update({
                turn: "O"
            })
        }
        else if (data.turn === "O" && data["user-o-email"] === currentUser.email && !data["tables"][id]) {
            ref.child(roomid).child("tables").update({
                [id]: data.turn
            })
            ref.child(roomid).update({
                turn: "X"
            })
        }
    })
}

function final() {
    setTimeout(function(){
        ref.child(roomid).once("value", snapshot => {
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
                num4 = data["tables"]["row-4-col-1"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-4-col-3"] == turn
                num5 = data["tables"]["row-5-col-1"] == turn && data["tables"]["row-5-col-2"] == turn && data["tables"]["row-5-col-3"] == turn
                num6 = data["tables"]["row-1-col-2"] == turn && data["tables"]["row-1-col-3"] == turn && data["tables"]["row-1-col-4"] == turn
                num7 = data["tables"]["row-2-col-2"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-2-col-4"] == turn
                num8 = data["tables"]["row-3-col-2"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-3-col-4"] == turn
                num9 = data["tables"]["row-4-col-2"] == turn && data["tables"]["row-4-col-3"] == turn && data["tables"]["row-4-col-4"] == turn
                num10 = data["tables"]["row-5-col-2"] == turn && data["tables"]["row-5-col-3"] == turn && data["tables"]["row-5-col-4"] == turn
                num11 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-1-col-4"] == turn && data["tables"]["row-1-col-5"] == turn
                num12 = data["tables"]["row-2-col-3"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-2-col-5"] == turn
                num13 = data["tables"]["row-3-col-3"] == turn && data["tables"]["row-3-col-4"] == turn && data["tables"]["row-3-col-5"] == turn
                num14 = data["tables"]["row-4-col-3"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-4-col-5"] == turn
                num15 = data["tables"]["row-5-col-3"] == turn && data["tables"]["row-5-col-4"] == turn && data["tables"]["row-5-col-5"] == turn
                //ตั้ง
                num16 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-1"] == turn && data["tables"]["row-3-col-1"] == turn
                num17 = data["tables"]["row-1-col-2"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-2"] == turn
                num18 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-3"] == turn
                num19 = data["tables"]["row-1-col-4"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-4"] == turn
                num20 = data["tables"]["row-1-col-5"] == turn && data["tables"]["row-2-col-5"] == turn && data["tables"]["row-3-col-5"] == turn
                num21 = data["tables"]["row-2-col-1"] == turn && data["tables"]["row-3-col-1"] == turn && data["tables"]["row-4-col-1"] == turn
                num22 = data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-4-col-2"] == turn
                num23 = data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-3"] == turn
                num24 = data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-4"] == turn && data["tables"]["row-4-col-4"] == turn
                num25 = data["tables"]["row-2-col-5"] == turn && data["tables"]["row-3-col-5"] == turn && data["tables"]["row-4-col-5"] == turn
                num26 = data["tables"]["row-3-col-1"] == turn && data["tables"]["row-4-col-1"] == turn && data["tables"]["row-5-col-1"] == turn
                num27 = data["tables"]["row-3-col-2"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-5-col-2"] == turn
                num28 = data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-3"] == turn && data["tables"]["row-5-col-3"] == turn
                num29 = data["tables"]["row-3-col-4"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-5-col-4"] == turn
                num30 = data["tables"]["row-3-col-5"] == turn && data["tables"]["row-4-col-5"] == turn && data["tables"]["row-5-col-5"] == turn
                //เฉียง
                num31 = data["tables"]["row-1-col-1"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-3"] == turn
                num32 = data["tables"]["row-1-col-2"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-4"] == turn
                num33 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-5"] == turn
                num34 = data["tables"]["row-1-col-3"] == turn && data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-1"] == turn
                num35 = data["tables"]["row-1-col-4"] == turn && data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-2"] == turn
                num36 = data["tables"]["row-1-col-5"] == turn && data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-3"] == turn
    
                num37 = data["tables"]["row-2-col-1"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-4-col-3"] == turn
                num38 = data["tables"]["row-2-col-2"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-4"] == turn
                num39 = data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-4"] == turn && data["tables"]["row-4-col-5"] == turn
                num40 = data["tables"]["row-2-col-3"] == turn && data["tables"]["row-3-col-2"] == turn && data["tables"]["row-4-col-1"] == turn
                num41 = data["tables"]["row-2-col-4"] == turn && data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-2"] == turn
                num42 = data["tables"]["row-2-col-5"] == turn && data["tables"]["row-3-col-4"] == turn && data["tables"]["row-4-col-3"] == turn
    
                num43 = data["tables"]["row-3-col-1"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-5-col-3"] == turn
                num44 = data["tables"]["row-3-col-2"] == turn && data["tables"]["row-4-col-3"] == turn && data["tables"]["row-5-col-4"] == turn
                num45 = data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-5-col-5"] == turn
                num46 = data["tables"]["row-3-col-3"] == turn && data["tables"]["row-4-col-2"] == turn && data["tables"]["row-5-col-1"] == turn
                num47 = data["tables"]["row-3-col-4"] == turn && data["tables"]["row-4-col-3"] == turn && data["tables"]["row-5-col-2"] == turn
                num48 = data["tables"]["row-3-col-5"] == turn && data["tables"]["row-4-col-4"] == turn && data["tables"]["row-5-col-3"] == turn
                
                if (num1 || num2 || num3 || num4 || num5 || num6 || num7 || num8 || num9 || num10 ||
                    num11 || num12 || num13 || num14 || num15 || num16 || num17 || num18 || num19 || num20 ||
                    num21 || num22 || num23 || num24 || num25 || num26 || num27 || num28 || num29 || num30 ||
                    num31 || num32 || num33 || num34 || num35 || num36 || num37 || num38 || num39 || num40 ||
                    num41 || num42 || num43 || num44 || num45 || num46 || num47 || num48 ) {
                        ref.child(roomid).update({
                        status: "finish",
                        winner: turn
                    })
                    id = data[`user-${turn.toLowerCase()}-id`]
                    console.log(id)
                    console.log('===||==========>')
                    // console.log(user.email)
                    ref_userdata.once('value', snapshot =>{
                        const usertype = snapshot.val();
                        Object.keys(usertype).forEach(key=>{
                            console.log('key = '+key)
                            if (key == id){
                                var user_score_4 = snapshot.child(id).child('Score').val() + 1;
                                ref_userdata.child(id).update({
                                    ['Score']: user_score_4,
                                });
                            }
                        })
                    })
                    changeyellow()
                        // ref_userdata.once('value', userData => {
                        //     var user_score_4 = userData.child(user.uid).child('Score').val() + 1;
                        //     ref_userdata.child(user.uid).update({
                        //         ['Score']: user_score_4,
                        //     });
                        //     document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " +  user_score_4 ;
                        // });
                    
                    
                   
                }
                if (data["tables"]["row-1-col-1"] && data["tables"]["row-1-col-2"] && data["tables"]["row-1-col-3"] && data["tables"]["row-1-col-4"] && data["tables"]["row-1-col-5"] &&
                data["tables"]["row-2-col-1"] && data["tables"]["row-2-col-2"] && data["tables"]["row-2-col-3"] && data["tables"]["row-2-col-4"] && data["tables"]["row-2-col-5"] &&
                data["tables"]["row-3-col-1"] && data["tables"]["row-3-col-2"] && data["tables"]["row-3-col-3"] && data["tables"]["row-3-col-4"] && data["tables"]["row-3-col-5"] &&
                data["tables"]["row-4-col-1"] && data["tables"]["row-4-col-2"] && data["tables"]["row-4-col-3"] && data["tables"]["row-4-col-4"] && data["tables"]["row-4-col-5"] &&
                data["tables"]["row-5-col-1"] && data["tables"]["row-5-col-2"] && data["tables"]["row-5-col-3"] && data["tables"]["row-5-col-4"] && data["tables"]["row-5-col-5"] ){
                    console.log('affdraw')
                    ref.child(roomid).update({
                        status: "finish",
                        winner: "draw"
                    })
                }
            }
        })

    }, 1000)
   
}

function changeyellow(){
    if (document.querySelector("#status-text").innerHTML == `Winner: O`){
        countwino += 1 ;
        if (countwino == 3){
            document.getElementById("victoryo-text").style.display = "block";
        }else{
        document.getElementById("wino-text").style.display = "block";
        }
    }else if (document.querySelector("#status-text").innerHTML == `Winner: X`){
        countwinx += 1;
        if (countwinx == 3){
            document.getElementById("victoryx-text").style.display = "block";
        }else{
        document.getElementById("winx-text").style.display = "block";
        }
    }
    
    
    if (countwino == 1){
        document.getElementById('ofirst').style.color='yellow';
    }else if (countwino == 2){
        document.getElementById('osecond').style.color='yellow';
    }else if (countwino == 3){
        document.getElementById('othird').style.color='yellow';
    }if (countwinx == 1){
        document.getElementById('xfirst').style.color='yellow';
    }else if (countwinx == 2){
        document.getElementById('xsecond').style.color='yellow';
    }else if (countwinx == 3){
        document.getElementById('xthird').style.color='yellow';
    }else{
        countwinx = 0
        countwino = 0
    }
}
function off(){
    document.getElementById("victoryx-text").style.display = "none";
    document.getElementById("victoryo-text").style.display = "none";
    countwinx = 0
    countwino = 0
    document.getElementById('xfirst').style.color='white';
    document.getElementById('xsecond').style.color='white';
    document.getElementById('xthird').style.color='white';
    document.getElementById('ofirst').style.color='white';
    document.getElementById('osecond').style.color='white';
    document.getElementById('othird').style.color='white';
    stopgame();
}

function offwin(){
    document.getElementById("winx-text").style.display = "none";
    document.getElementById("wino-text").style.display = "none";
    stopgame();
}

function showscore(){
    //  refScore.once("value", function(snapshot){
    //     // var data = snapshot.val();
    //     // for (let i in data){
    //     //     console.log(data[i])
    //     // }
    //     snapshot.forEach(function(element){
    //         document.querySelector('#root').innerHTML +=`<div>${element.val()}</div`
    //     });
    // })
//     refScore.on("value", function(snapshot) {

//         snapshot.forEach(function(childSnapshot) {
//           var item_id = childSnapshot.name();
//           var qty = childSnapshot.val();
      
//               refMenu.child(item_id).once("value", function(snapshot) {
//                 var item = snapshot.val()
//                 console.log(item.name +' '+ item.price)
//               });
      
//        });
      
//       });
 }
 function calluserboard(){
 ref_userdata.on("value", (data) => {
    ReadList(data);
});
 }

 function ReadList(snapshot) {
    
     document.getElementById("name-list").innerHTML = ``;
     snapshot.forEach((data) => {
         const id = data.key;
         const Name = data.val().Name;
         const Score = data.val().Score;
         document.getElementById('leader_body').innerHTML += `<tr id="${id}"><td>${Name}</td><td>${Score}</td></tr>`
         num++;
     });
     sortTable()
 }
 function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("leader_board");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[1];
        y = rows[i + 1].getElementsByTagName("TD")[1];
        // Check if the two rows should switch place:
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
 

