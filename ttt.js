/*
 * ttt.js
 *
 * Tic-Tac-Toe game
 */

doc_mock = {
    querySelector: (arg) => { return ":)"; }
}


// Create and return a GameBoard object
// Take a reference to document
function createBoard(doc) {

    const boardData = new Array(9);
    const boardElements = new Array(9);


    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
            let idx = c + 3 * r;
            boardElements[idx] = doc.querySelector(
                `ttt-cell.row-${r}.col-${c}`
            );
        }
    }

    function printBoard() {
        console.log("_________________");
        for (let r = 0; r < 3; r++) {
            let printstr = "";
            for (let c = 0; c < 3; c++) {

                let idx = c + 3 * r;
                printstr += (boardData[idx] ? boardData[idx] : " ") + "|";
            }
            console.log(printstr);
        }
    }

    // place X or O in board. Return 0 if successful placement, or -1
    // if placement invalid
    function place(token, row, column) {
        let idx = column + 3 * row;
        boardData[idx] = token;
    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            boardData[i] = undefined;
        }
    }


    return { printBoard, place, resetBoard };

}


function createPlayer(player_token) {
    let wins = 0;
    let losses = 0;

    let token = player_token;

    function getWins() {
        return wins;
    }

    function getLosses() {
        return losses;
    }

    function win() {
        wins++;
    }

    function lose() {
        losses++;
    }

    function setToken(new_token) {
        token = new_token;
    }

    function getToken() {
        return token;
    }

    return { getWins, getLosses, win, lose, setToken, getToken };
}


// Factory for a game object
function createGame() {

    let humanPlayer = createPlayer();
    let aiPlayer = createPlayer();




}

// Factory for a round of tic tac toe
function createRound() { }



let myboard = (
    typeof document === "undefined"
        ? createBoard(doc_mock)
        : createBoard(document)
);


myboard.place("X", 1, 1);
myboard.printBoard();



