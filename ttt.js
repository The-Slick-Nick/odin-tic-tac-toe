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


function createBoardCell(doc, row, col) {

    const boardCell = doc.createElement("div");

    boardCell.classList.add("board-cell");
    boardCell.classList.add(`row-${row}`);
    boardCell.classList.add(`col-${col}`);

    const cellToken = doc.createElement("div");
    cellToken.classList.add("board-token");

    boardCell.appendChild(cellToken);

    return { cellDom: boardCell };

}


// Create and return a GameBoard object
// Take a reference to document
function createBoard(doc) {

    const boardData = new Array(9);
    const boardElements = new Array(9);

    for (let i = 0; i < 9; i++) {
        boardData[i] = null;  // use null, not undefined
    }

    const boardDom = doc.createElement("div");
    boardDom.classList.add("board-frame");


    // TODO: Perhaps take board size as an argument

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let idx = c + 3 * r;

            const boardCell = createBoardCell(doc, r, c);
            boardDom.appendChild(boardCell.cellDom);

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
        console.log("Attempting to access idx " + idx);

        boardElements[idx]
            .cellDom
            .querySelector(".board-token")
            .classList
            .add(`token-${token}`);

    }

    function getTokenAt(row, column) {
        let idx = column + 3 * row;
        return boardData[idx];
    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            boardData[i] = null;
            const allClasses = boardElements[i].cellDom.className;
            if (allClasses) {
                allClasses
                    .split(" ")
                    .filter(c => c.startsWith("token"))
                    .forEach((cl) => {
                        boardElements[i].cellDom.classList.remove(cl);
                    });
            }
        }
    }

    // Assess the state of the game board
    // Returns:
    // complete: boolean - is the game over
    // winner: winning token, if any. If nobody won, is null
    function getState() {


        // rows
        for (let ckRow = 0; ckRow < 3; ckRow++) {
            let basis = boardData[0 + 3 * ckRow];
            if (basis === null) {
                continue;
            }

            let rowMatch = true;
            for (let ckCol = 0; ckCol < 3; ckCol++) {
                if (boardData[ckCol + ckRow * 3] !== basis) {
                    rowMatch = false;
                    break;
                }
            }

            if (rowMatch) {
                alert("ROW " + ckRow + " ALL MATCHING");
                return {
                    complete: true,
                    winner: basis
                };
            }
        }


        // columns
        for (let ckCol = 0; ckCol < 3; ckCol++) {
            let basis = boardData[ckCol];
            if (basis === null) {
                continue;
            }

            let colMatch = true;
            for (let ckRow = 0; ckRow < 3; ckRow++) {
                if (boardData[ckCol + ckRow * 3] !== basis) {
                    colMatch = false;
                    break;
                }
            }

            if (colMatch) {
                return {
                    complete: true,
                    winner: basis
                };
            }
        }

        // diagonals
        let basis = boardData[0];
        if (basis !== null) {
            let diagSeMatch = true;
            for (let ckIdx = 0; ckIdx < 3; ckIdx++) {

                if (boardData[ckIdx + ckIdx * 3] !== basis) {
                    diagSeMatch = false;
                    break;
                }
            }
            if (diagSeMatch) {
                return {
                    complete: true,
                    winner: basis
                }
            }
        }

        basis = boardData[2];
        if (basis !== null) {
            let diagSwMatch = true;
            for (let ckIdx = 0; ckIdx < 3; ckIdx++) {

                if (boardData[2 - ckIdx + ckIdx * 3] !== basis) {
                    diagSwMatch = false;
                    break;
                }
            }

            if (diagSwMatch) {
                return {
                    complete: true,
                    winner: basis
                }
            }
        }


        let cellsFilled = 0;
        for (let ckRow = 0; ckRow < 3; ckRow++) {
            for (let ckCol = 0; ckCol < 3; ckCol++) {
                if (boardData[ckCol + ckRow * 3] !== null) {
                    cellsFilled++;
                }
            }
        }

        return {
            complete: cellsFilled === 9,
            winner: null
        };
    }

    return { printBoard, place, resetBoard, getTokenAt, boardDom, getState };
}



/**
 * Create a player object
 *
 * @param doc - DOM "document" reference or equivalent mock
 * @param player_token - Single character token player will use. "x" or "o"
 * @param strategy - Default null - Function taking a gameBoard object and
 *                   returning a chosen location to play a token. If null,
 *                   defaults to waiting for human input
 */
function createPlayer(doc, player_token, strategy = null) {
    let wins = 0;
    let losses = 0;

    const scoreLabel = doc.createElement("div");
    scoreLabel.classList.add(`token-${player_token}`);
    scoreLabel.classList.add("score-label");
    scoreLabel.innerText = wins;

    let token = player_token;

    function getWins() {
        return wins;
    }

    function getLosses() {
        return losses;
    }

    function win() {
        wins++;
        scoreLabel.innerText = wins;
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

    return {
        getWins, getLosses, win, lose, setToken, getToken,
        scoreLabel, strategy
    };
}


function runGame(doc) {

    const boardTarget = doc.querySelector(".gameboard-container");
    const labelTarget = doc.querySelector(".label-container");

    const p1 = createPlayer(doc, 'x');
    const p2 = createPlayer(doc, 'o');
    const board = createBoard(doc);

    const players = [p1, p2];
    let playerIdx = 0;

    boardTarget.appendChild(board.boardDom);
    labelTarget.appendChild(p1.scoreLabel);
    labelTarget.appendChild(p2.scoreLabel);



    board.boardDom.addEventListener("click", (e) => {

        const cellElem = e.target;
        const tokenElem = cellElem.querySelector(".board-token");

        const currentPlayer = players[playerIdx];

        let rowcoord;
        let colcoord;
        let token = null;

        cellElem.className.split(" ").forEach((cls) => {

            if (cls.startsWith("row")) {
                rowcoord = parseInt(cls.split("-")[1]);
            }

            if (cls.startsWith("col")) {
                colcoord = parseInt(cls.split("-")[1]);
            }
        });

        tokenCls = tokenElem
            .className
            .split(" ")
            .filter((elm) => elm.startsWith("token"))

        if (tokenCls.length > 0) {
            token = tokenCls[0].split("-")[1];
        }
        else {
            token = null;
        }


        if (token === null) {
            board.place(currentPlayer.getToken(), rowcoord, colcoord);

            // check for a winner

            let boardState = board.getState();

            if (boardState.complete) {
                alert("Game is complete!");
                if (boardState.winner !== null) {

                    // use token to filter for winner
                    players.forEach((p) => {
                        if (p.getToken() === boardState.winner) {
                            p.win();
                        }
                        else {
                            p.lose();
                        }
                    });
                }
                else {
                    alert("Nobody won!");
                }
                board.resetBoard();
            }


            playerIdx = (playerIdx + 1) % players.length;
        }
    });

}

runGame(document);

/****************/

const testSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const testPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
testPath.setAttribute("d", "M0,0 L32,32 M0,32 L32,0");
testPath.setAttribute("style", "fill:none;stroke:green;stroke-width:3;");

testSvg.appendChild(testPath);
testSvg.setAttribute("height", "32");
testSvg.setAttribute("width", "32");

document.querySelector("body").appendChild(testSvg);
