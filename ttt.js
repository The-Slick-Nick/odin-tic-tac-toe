/*
 * ttt.js
 *
 * Tic-Tac-Toe game
 */


classlist_mock = {
    add: (cls) => { console.log(`Added class ${cls} to mock`); },
    remove: (cls) => { console.log(`Removed class ${cls} from mock`); },
    toggle: (cls) => { console.log(`Toggled class ${cls} on mock`); }
}

// mock of a dom element
dom_mock = {
    classList: classlist_mock,
    appendChild: (arg) => { console.log("Added a child node to mock"); }
}

doc_mock = {
    querySelector: (arg) => { return dom_mock; },
    createElement: (arg) => { return dom_mock; }
}


// Create and return a GameBoard object
// Take a reference to document
function createBoard(doc) {

    const boardData = new Array(9);
    const boardElements = new Array(9);

    const pageBody = doc.querySelector("body");
    const boardDom = doc.createElement("div");
    boardDom.classList.add("board-container");

    pageBody.appendChild(boardDom);

    // TODO: Perhaps take board size as an argument

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let idx = c + 3 * r;

            const boardCell = doc.createElement("div");
            boardCell.classList.add("board-cell");
            boardCell.classList.add(`row-${r}`);
            boardCell.classList.add(`col-${c}`);

            boardDom.appendChild(boardCell);

            boardElements[idx] = boardCell;
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
        boardElements[idx].classList.add(`token-${token}`);

    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            boardData[i] = undefined;
            const allClasses = boardElements[i].className;
            if (allClasses) {
                allClasses
                    .split(" ")
                    .filter(c => c.startsWith("token"))
                    .forEach((cl) => { boardElements[i].classList.remove(cl); });
            }
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

if (typeof document === "undefined") {
    console.log("NO DOCUMENT");
}
else {
    console.log(document);
}


let myboard = (
    typeof document === "undefined"
        ? createBoard(doc_mock)
        : createBoard(document)
);


myboard.place("X", 1, 1);
myboard.printBoard();



document.querySelector(".test").addEventListener("click", (e) => { myboard.resetBoard(); });
