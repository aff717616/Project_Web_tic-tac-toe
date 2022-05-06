const table2 = document.querySelector(`#table`);
// const row2 = document.querySelector(`#table .row`);
// const show = document.querySelector(`#show`);
let rotateVal = 0;

function turnLeft() {
    rotateVal -= 90;
    table2.style.cssText = `transform: rotateZ(${rotateVal}deg);`
    changeID(`turnleft`);
    // show.innerText = `left rotateVal= ${rotateVal}`;
    allGravity();
    TableWidthHeightToggle();
    document.querySelector(".turn-left").disabled = true;
    document.querySelector(".turn-right").disabled = true;
}

function turnRight() {
    rotateVal += 90;
    table2.style.cssText = `transform: rotateZ(${rotateVal}deg);`
    changeID(`turnright`);
    // show.innerText = `right rotateVal= ${rotateVal}`;
    allGravity();
    TableWidthHeightToggle();
    document.querySelector(".turn-left").disabled = true;
    document.querySelector(".turn-right").disabled = true;
}

function TableWidthHeightToggle() {
    tableWidth = table2.offsetWidth;
    // tableHeight = table2.offsetHeight;
    console.log(tableWidth, typeof(tableWidth));
    // console.log(tableHeight);
    // table2.style.width = `${tableHeight}px`;
    table2.style.height = `${tableWidth}px`;
    // console.log('table height' = tableHeight);
    // table2.style.width = `${tableHeight}px`;
}

function gravity(id) {
    // let rowCurrent = id.charAt(4);
    let colCurrent = id.charAt(10);
    let checkRow5 = document.querySelector(`#row-5-col-${colCurrent} p`).innerText
    let checkRow4 = document.querySelector(`#row-4-col-${colCurrent} p`).innerText
    let checkRow3 = document.querySelector(`#row-3-col-${colCurrent} p`).innerText
    let checkRow2 = document.querySelector(`#row-2-col-${colCurrent} p`).innerText
    let checkRow1 = document.querySelector(`#row-1-col-${colCurrent} p`).innerText
    console.log(checkRow5);
    if (checkRow5 != 'X' && checkRow5 != 'O') {
        id = `row-5-col-${colCurrent}`;
    } else if (checkRow4 != 'X' && checkRow4 != 'O') {
        id = `row-4-col-${colCurrent}`;
    } else if (checkRow3 != 'X' && checkRow3 != 'O') {
        id = `row-3-col-${colCurrent}`;
    } else if (checkRow2 != 'X' && checkRow2 != 'O') {
        id = `row-2-col-${colCurrent}`;
    } else if (checkRow1 != 'X' && checkRow1 != 'O') {
        id = `row-1-col-${colCurrent}`;
    }
    return id;
}

function changeID(rotateDirection) {
    for (let row = 1; row < 6; row++) {
        for (let col = 1; col < 6; col++) {
            box = document.querySelector(`#row-${row}-col-${col}`);
            if (rotateDirection == `turnleft`) {
                rowChange = 6 - col;
                colChange = row;
            } else if (rotateDirection == `turnright`) {
                rowChange = col;
                colChange = 6 - row;
            }
            box.id = `new-row-${rowChange}-col-${colChange}`
        }
    }
    for (let row = 1; row < 6; row++) {
        for (let col = 1; col < 6; col++) {
            box = document.querySelector(`#new-row-${row}-col-${col}`);
            box.id = box.id.slice(4);
            // box.firstElementChild.innerText = box.id;
        }
    }
}

function allGravity() {
    
    listMarker = keepMarker();
    listMarkerCol1 = [];
    listMarkerCol2 = [];
    listMarkerCol3 = [];
    listMarkerCol4 = [];
    listMarkerCol5 = [];
    for (let col = 1; col < 6; col++) {
        for (let row = 5; row > 0; row--) {
            box = document.querySelector(`#row-${row}-col-${col}`);
            Marker = box.firstElementChild.innerText
            hasMarker = Marker == `X` || Marker == `O`;
            if (hasMarker) {
                switch (col) {
                    case 1:
                        listMarkerCol1.push(Marker);
                        break;
                    case 2:
                        listMarkerCol2.push(Marker);
                        break;
                    case 3:
                        listMarkerCol3.push(Marker);
                        break;
                    case 4:
                        listMarkerCol4.push(Marker);
                        break;
                    case 5:
                        listMarkerCol5.push(Marker);
                }
                Marker = ``;
            }
        }
    }
    for (let col = 1; col < 6; col++) {
        for (let row = 5; row > 0; row--) {
            box = document.querySelector(`#row-${row}-col-${col}`);
            boxText = box.firstElementChild;
            switch (col) {
                case 1:
                    if (listMarkerCol1[0] == undefined) { listMarkerCol1[0] = `` }
                    boxText.innerText = listMarkerCol1[0];
                    // boxText = '1';
                    // console.log(listMarkerCol1[0]);
                    listMarkerCol1.shift();
                    break;
                case 2:
                    if (listMarkerCol2[0] == undefined) { listMarkerCol2[0] = `` }
                    boxText.innerText = listMarkerCol2[0];
                    // boxText = '2';
                    // console.log(listMarkerCol2[0]);
                    listMarkerCol2.shift();
                    break;
                case 3:
                    if (listMarkerCol3[0] == undefined) { listMarkerCol3[0] = `` }
                    boxText.innerText = listMarkerCol3[0]
                        // boxText = '3';
                        // console.log(listMarkerCol3[0]);
                    listMarkerCol3.shift();
                    break;
                case 4:
                    if (listMarkerCol4[0] == undefined) { listMarkerCol4[0] = `` }
                    boxText.innerText = listMarkerCol4[0]
                        // boxText = '4';
                        // console.log(listMarkerCol4[0]);
                    listMarkerCol4.shift();
                    break;
                case 5:
                    if (listMarkerCol5[0] == undefined) { listMarkerCol5[0] = `` }
                    boxText.innerText = listMarkerCol5[0]
                        // boxText = '5';
                        // console.log(listMarkerCol5[0]);
                    listMarkerCol5.shift();
            }
        }
    }
    
    listMarker2 = keepMarker()
    for (let row = 1; row < 6; row++) {
        for (let col = 1; col < 6; col++) {
            boxID = `row-${row}-col-${col}`;
            marker = listMarker2[0]
            ref.child(roomid).child("tables").update({
                [boxID]: marker
            })
            listMarker2.shift();
        }
    }
}

function toggleIDnoRotate(rotateDirection) {
    listMarker = keepMarker();
    for (let row = 1; row < 6; row++) {
        for (let col = 1; col < 6; col++) {
            if (rotateDirection == `turnleft`) {
                rowChange = 6 - col;
                colChange = row;
            } else if (rotateDirection == `turnright`) {
                rowChange = col;
                colChange = 6 - row;
            }
            box = document.querySelector(`#row-${rowChange}-col-${colChange}`);
            box.firstElementChild.innerText = listMarker[0];
            listMarker.shift();

        }
    }

}

function keepMarker() {
    listMarker = [];
    for (let row = 1; row < 6; row++) {
        for (let col = 1; col < 6; col++) {
            box = document.querySelector(`#row-${row}-col-${col}`);
            marker = box.firstElementChild.innerText
            listMarker.push(marker)
        }
    }
    return listMarker;
}
// function gotodatabase(){
    
//     for (let row = 1; row < 6; row++) {
//         for (let col = 1; col < 6; col++) {
//             box = document.querySelector(`#row-${row}-col-${col}`);
//             marker = box.firstElementChild.innerText
//             console.log(document.querySelector(`#row-${row}-col-${col}`).firstElementChild.innerText + '/1')
//             // ref.child(roomid).child("tables").child(`row-${row}-col-${col}`).remove()
//             console.log(document.querySelector(`#row-${row}-col-${col}`).firstElementChild.innerText + '/2')
//             ref.child(roomid).child("tables").update({
//                 [box.id]: marker  
//             })
//             console.log(document.querySelector(`#row-${row}-col-${col}`).firstElementChild.innerText +'/3')
            
//         }
//     }
// }
// function deletena(){
//     for (let row = 1; row < 6; row++) {
//         for (let col = 1; col < 6; col++) {
//             console.log('delete row = '+row+'col = '+col)
            
//         }
//     }
// }