var sprites = ["#", "%", "r", "R", "b", "B"];
var pieces = [];
var turnInProgress = false;
var player = false;
var boards = [];
var moves = [];
var currentMove = 0;

var outBoard = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];

function initBoard() {
    outBoard = [
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1]
    ];
}

function setPieceValues(num, setState, setX, setY, setColor, setSelected) {
    pieces[num] = {
        state: setState, //states: 0 = dead, 1 = normal, 2 = king
        x: setX,
        y: setY,
        color: setColor, //colors: true = red, false = black
        selected: setSelected
    };
};

function initPieces() {
    let pieceNum = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (y < 3 && outBoard[y][x] == 0) {
                setPieceValues(pieceNum, 1, x, y, false, false);
                pieceNum++;
            }
            if (y > 4 && outBoard[y][x] == 0) {
                setPieceValues(pieceNum, 1, x, y, true, false);
                pieceNum++;
            }
        }
    }
}

function selectSpace(event) {
    //selecting piece
    var id = event.target.id;
    var anySelected = false;
    var x = parseInt(id.substring(0, 1));
    var y = parseInt(id.substring(2, 3));
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].selected == true) { anySelected = true }
    }
    if (anySelected == false) {
        if (outBoard[y][x] > 1) {
            for (var j = 0; j < pieces.length; j++) {
                if (pieces[j].x == x && pieces[j].y == y && pieces[j].state > 0 && pieces[j].color == player) { pieces[j].selected = true }
            }
        }
    }
    //moving piece
    else {
        for (var k = 0; k < pieces.length; k++) {
            if (pieces[k].selected) {
                if (pieces[k].state == 2) {
                    if (turnInProgress == false && pieces[k].color == player && outBoard[y][x] < 2 && (Math.abs(pieces[k].x - x) == 1 && Math.abs(pieces[k].y - y) == 1)) {
                        setPieceValues(k, pieces[k].state, x, y, pieces[k].color, false);
                        switchPlayer();
                    } else if (pieces[k].color == player && outBoard[y][x] < 2 && isEnemy(k, pieces[k].x + ((x - pieces[k].x) / 2), pieces[k].y + ((y - pieces[k].y) / 2)) && (Math.abs(pieces[k].x - x) == 2 && Math.abs(pieces[k].y - y) == 2)) {
                        var enemyNum = returnEnemy(pieces[k].x + ((x - pieces[k].x) / 2), pieces[k].y + ((y - pieces[k].y) / 2));
                        setPieceValues(k, pieces[k].state, x, y, pieces[k].color, true);
                        setPieceValues(enemyNum, 0, pieces[enemyNum].x, pieces[enemyNum].y, pieces[enemyNum].color, false);
                        turnInProgress = true;
                        document.getElementById("end-turn-btn").onclick = switchPlayer;
                        document.getElementById("end-turn-btn").style.background = "white";
                    } else {
                        if (!turnInProgress) {
                            pieces[k].selected = false;
                        }
                    }
                } else if (pieces[k].color) {
                    movePiece(k, -1, x, y);
                } else {
                    movePiece(k, 1, x, y);
                }
            }
        }
    }
    initBoard();
    render();
}

function movePiece(num, amount, x, y) {
    if (turnInProgress == false && pieces[num].color == player && outBoard[y][x] < 2 && ((x == pieces[num].x - 1 && y == pieces[num].y + amount) || ((x == pieces[num].x + 1 && y == pieces[num].y + amount)))) {
        setPieceValues(num, pieces[num].state, x, y, pieces[num].color, false);
        switchPlayer();
    } else if (pieces[num].color == player && outBoard[y][x] < 2 && isEnemy(num, pieces[num].x + ((x - pieces[num].x) / 2), pieces[num].y + amount) && ((x == pieces[num].x - 2 && y == pieces[num].y + (amount * 2)) || (x == pieces[num].x + 2 && y == pieces[num].y + (amount * 2)))) {
        var enemyNum = returnEnemy(pieces[num].x + ((x - pieces[num].x) / 2), pieces[num].y + amount);
        setPieceValues(num, pieces[num].state, x, y, pieces[num].color, true);
        setPieceValues(enemyNum, 0, pieces[enemyNum].x, pieces[enemyNum].y, pieces[enemyNum].color, false);
        turnInProgress = true;
        document.getElementById("end-turn-btn").onclick = switchPlayer;
        document.getElementById("end-turn-btn").style.background = "white";
    } else {
        if (!turnInProgress) {
            pieces[num].selected = false;
        }
    }
}

function isEnemy(num, x, y) {
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].x == x && pieces[i].y == y && pieces[i].state > 0 && pieces[i].color != pieces[num].color) {
            return true;
        }
    }
}

function returnEnemy(x, y) {
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].x == x && pieces[i].y == y && pieces[i].state > 0) {
            return i;
        }
    }
}

function render() {

    for (var i = 0; i < 8; i++) {
        document.getElementById("" + i).innerHTML = "";
    }

    //Winning
    var anyAliveRed = false;
    var anyAliveBlack = false;
    for (var h = 0; h < pieces.length; h++) {
        if (pieces[h].state > 0) {
            if (pieces[h].color) { anyAliveRed = true; }
            else { anyAliveBlack = true; }
        }
    }
    if (!anyAliveRed || !anyAliveBlack) {
        document.getElementById("my-body").innerHTML = (anyAliveRed ? "Red" : "Black") + " wins!!";
        var formElement = document.createElement("form");
        var buttonElement = document.createElement("button");
        buttonElement.onclick = "document.location.reload(true)";
        buttonElement.innerHTML = "Restart Game";
        formElement.appendChild(buttonElement);
        document.getElementById("my-body").appendChild(formElement);
    }

    for (var j = 0; j < pieces.length; j++) {
        if (pieces[j].color && pieces[j].y == 0) {
            pieces[j].state = 2;
        } else if (!pieces[j].color && pieces[j].y == 7) {
            pieces[j].state = 2;
        }
        if (pieces[j].state == 1 && pieces[j].color) { outBoard[pieces[j].y][pieces[j].x] = 2; }
        if (pieces[j].state == 1 && !pieces[j].color) { outBoard[pieces[j].y][pieces[j].x] = 4; }
        if (pieces[j].state == 2 && pieces[j].color) { outBoard[pieces[j].y][pieces[j].x] = 3; }
        if (pieces[j].state == 2 && !pieces[j].color) { outBoard[pieces[j].y][pieces[j].x] = 5; }

        //Winning!!

    }


    for (var y = 0; y < outBoard.length; y++) {
        for (var x = 0; x < outBoard[y].length; x++) {
            var newElement = document.createElement("td");
            newElement.id = "" + x + ":" + y;
            newElement.innerHTML = sprites[outBoard[y][x]];
            //newElement.onclick = console.log(this)/*selectSpace(this.id)*/;
            newElement.addEventListener("click", selectSpace);
            var destination = document.getElementById("" + y);
            destination.appendChild(newElement);

            //coloring pieces
            if (outBoard[y][x] == 0) { document.getElementById(newElement.id).style.color = "tan"; }
            else if (outBoard[y][x] == 1) { document.getElementById(newElement.id).style.color = "brown"; }
            else if (outBoard[y][x] == 2 || outBoard[y][x] == 3) { document.getElementById(newElement.id).style.color = "red"; }
            else { document.getElementById(newElement.id).style.color = "black"; }

            //coloring background
            if ((isOdd(y) && isOdd(x)) || (!isOdd(y) && !isOdd(x))) { document.getElementById(newElement.id).style.backgroundColor = "brown"; }
            else { document.getElementById(newElement.id).style.backgroundColor = "tan"; }
        }
    }
    for (var q = 0; q < pieces.length; q++) {
        if (pieces[q].selected == true) {
            document.getElementById(pieces[q].x + ":" + pieces[q].y).style.color = "blue";
        }
    }

    //text that displays player
    document.getElementById("turn-text").innerHTML = (player ? "Red" : "Black") + "'s turn";

}

function isOdd(num) {
    return (num % 2);
}

function switchPlayer() {
    player = (player + 1) % 2;
    turnInProgress = false;
    for (var i = 0; i < pieces.length; i++) {
        pieces[i].selected = false;
    }
    /* boards.push(outBoard);
     moves.push();
     for (var i = 0; i < pieces.length; i++){
         moves[currentMove].push({
             state: pieces[i].state, 
             x: pieces[i].x,
             y: pieces[i].y,
             color: pieces[i].color, 
             selected: pieces[i].selected,
         })
     }
     currentMove++;*/
    document.getElementById("end-turn-btn").onclick = "";
    document.getElementById("end-turn-btn").style.background = "gray";
    render();
}

/*function undo() {
    if (currentMove != 0) {
        //outBoard = boards[currentMove - 1];
        pieces = moves[currentMove - 1];
        currentMove--;
        switchPlayer();
        //shiftLast(boards);
        shiftLast(moves);
        render();
    }
}*/

function shiftLast(array) {
    array.reverse();
    array.shift();
    array.reverse();
}

document.getElementById("end-turn-btn").style.background = "gray";
initPieces();
boards.push(outBoard);
moves.push(pieces);
render();