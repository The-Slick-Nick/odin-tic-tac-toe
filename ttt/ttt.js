/*
 * ttt.js
 *
 * Tic-Tac-Toe game
 *
 * upon createGame, generates dom elements as
 * .board-frame
 *      .board-cell * 9
 *          .token
 *
 *  Game object exposes a "boardDom" property, to be
 *  added modularly to wherever.
 */





function createBoardCell(doc, row, col) {

    let cellDom = doc.createElement("div");

    cellDom.classList.add("board-cell");
    cellDom.classList.add(`row-${row}`);
    cellDom.classList.add(`col-${col}`);

    let tokenDom = null;
    let token = "";

    return {
        get cellDom() {
            return cellDom;
        },

        // place token, replacing any that currently exist
        placeToken: (toPlace) => {
            toPlace = toPlace.toLowerCase();
            if (toPlace !== 'o' && toPlace !== 'x') {
                throw new Error(`Invalid token ${toPlace}`);
            }

            token = toPlace;
            tokenDom = null;

            // ... because .children has no .forEach()
            [].forEach.call(
                cellDom.children,
                (elm) => cellDom.removeChild(elm)
            );

            tokenDom = doc.createElement("div");
            tokenDom.classList.add("token");
            tokenDom.classList.add(token);

            cellDom.appendChild(tokenDom);

        },

        removeToken: () => {

            token = "";
            tokenDom = null;

            // ... because .children has no .forEach()
            [].forEach.call(
                cellDom.children,
                (elm) => cellDom.removeChild(elm)
            );

        },

        // get current token, or empty string if none
        get token() {
            return token;
        },

        get row() {
            return row;
        },

        get col() {
            return col;
        },

        destroy: () => {

            [].forEach.call(
                cellDom.children,
                (elm) => cellDom.removeChild(elm)
            );
            tokenDom = null;

            cellDom.remove();
            cellDom = null;
        }
    }
}


// Create and return a GameBoard object
// Take a reference to document
function createGameBoard(doc) {

    const cellObjs = new Array(9);

    let boardDom = doc.createElement("div");
    boardDom.classList.add("board-frame");


    // TODO: Perhaps take board size as an argument

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let idx = c + 3 * r;

            const boardCell = createBoardCell(doc, r, c);
            boardDom.appendChild(boardCell.cellDom);
            cellObjs[idx] = boardCell;
        }
    }

    function printBoard() {
        console.log("_________________");
        for (let r = 0; r < 3; r++) {
            let printstr = "";
            for (let c = 0; c < 3; c++) {

                let idx = c + 3 * r;
                printstr += cellObjs[idx].token;
            }
            console.log(printstr);
        }
    }

    // place X or O in board. Return 0 if successful placement, or -1
    // if placement invalid
    function place(token, row, column) {
        let idx = column + 3 * row;

        cellObjs[idx].placeToken(token);
    }

    function getTokenAt(row, column) {
        let idx = column + 3 * row;
        return cellObjs[idx].token;
    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            cellObjs[i].removeToken();
        }
    }

    // Assess the state of the game board
    // Returns:
    // complete: boolean - is the game over
    // winner: winning token, if any. If nobody won, empty string
    function getState() {

        // rows
        for (let ckRow = 0; ckRow < 3; ckRow++) {

            let basis = getTokenAt(ckRow, 0);
            if (basis === "") {
                continue;
            }

            let rowMatch = true;
            for (let ckCol = 0; ckCol < 3; ckCol++) {
                if (getTokenAt(ckRow, ckCol) !== basis) {
                    rowMatch = false;
                    break;
                }
            }

            if (rowMatch) {
                return {
                    complete: true,
                    winner: basis
                };
            }
        }


        // columns
        for (let ckCol = 0; ckCol < 3; ckCol++) {
            let basis = getTokenAt(0, ckCol);
            if (basis === "") {
                continue;
            }

            let colMatch = true;
            for (let ckRow = 0; ckRow < 3; ckRow++) {
                if (getTokenAt(ckRow, ckCol) !== basis) {
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
        let basis = getTokenAt(0, 0);
        if (basis !== "") {
            let diagSeMatch = true;
            for (let ckIdx = 0; ckIdx < 3; ckIdx++) {
                if (getTokenAt(ckIdx, ckIdx) !== basis) {
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

        basis = getTokenAt(0, 2);
        if (basis !== "") {
            let diagSwMatch = true;
            for (let ckIdx = 0; ckIdx < 3; ckIdx++) {

                if (getTokenAt(ckIdx, 2 - ckIdx) !== basis) {
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
                if (getTokenAt(ckRow, ckCol) !== "") {
                    cellsFilled++;
                }
            }
        }

        return {
            complete: cellsFilled === 9,
            winner: ""
        };
    }

    // Get boardCell object from a passed dom element, returning null
    // if it doesn't exist
    function getCellFromDom(cellDom) {

        for (let idx = 0; idx < 9; idx++) {
            if (cellObjs[idx].cellDom === cellDom) {
                return cellObjs[idx];
            }

        }
        return null;
    }

    function destroy() {
        for (let idx = 0; idx < 9; idx++) {
            cellObjs[idx].destroy();
            cellObjs[idx] = null;
        }

        boardDom.remove();
        boardDom = null;

    }

    return {
        printBoard, place, resetBoard, getTokenAt, boardDom, getState,
        getCellFromDom, destroy,
        get boardDom() {
            return boardDom;
        }
    };
}



/**
 * Create a player object
 *
 * @param doc - DOM "document" reference or equivalent mock
 * @param name - String name used to refer to player. Musn't be empty
 * @param token - Single character token player will use. "x" or "o"
 * @param strategy - Default "" - Function taking a gameBoard object and
 *                   returning a chosen location to play a token. If "",
 *                   defaults to waiting for human input
 */
function createPlayer(doc, name, token, strategy = null) {
    let wins = 0;
    let losses = 0;

    const scoreLabel = doc.createElement("div");
    scoreLabel.classList.add(`token-${token}`);
    scoreLabel.classList.add("score-label");
    scoreLabel.innerText = `${name}: ${wins}`;

    function getWins() {
        return wins;
    }

    function getLosses() {
        return losses;
    }

    function win() {
        wins++;
        scoreLabel.innerText = `${name}: ${wins}`;
    }

    function lose() {
        losses++;
    }

    function setToken(newToken) {
        token = newToken;
    }

    function getToken() {
        return token;
    }

    // clear/remove all created and appended dom elements
    function destroy() {
        scoreLabel.remove();
    }

    return {
        getWins, getLosses, win, lose, setToken, getToken,
        scoreLabel, strategy, destroy,
        get token() {
            return token;
        },
        get name() {
            return name;
        }
    };
}


function createGame(
    doc, p1, p2, boardTarget
) {

    const board = createGameBoard(doc);

    const stateCallbacks = [];
    const players = [p1, p2];
    let playerIdx = 0;

    boardTarget.appendChild(board.boardDom);

    board.boardDom.addEventListener("click", (e) => {

        // ignore clicks on completed game
        if (board.getState().complete) {
            return;
        }

        const cellDom = e.target;
        const cellElem = board.getCellFromDom(cellDom);

        if (cellElem === null) {
            return;
        }

        const currentPlayer = players[playerIdx];
        // ai, not clickable
        if (currentPlayer.strategy !== null) {
            return;
        }

        placeToken(currentPlayer.token, cellElem.row, cellElem.col);

    });

    function placeToken(token, row, col) {

        // ignore completed game
        // ends recursion (if 2 ai players)
        if (board.getState().complete) {
            return;
        }

        if (token === "") {
            return;
        }

        board.place(token, row, col);

        const boardState = board.getState();
        if (boardState.complete && boardState.winner !== "") {
            players.forEach((p) => {
                if (p.token === boardState.winner) {
                    p.win();
                }
                else {
                    p.lose();
                }
            });
        }

        stateCallbacks.forEach((cb) => { cb(); });


        playerIdx = (playerIdx + 1) % players.length;
        if (players[playerIdx].strategy !== null) {
            // call strategy(board) to determine cell to place
            // perform placement after some time

            let strat = players[playerIdx].strategy;
            setTimeout(() => strat(board), 1000);
        }

    }

    return {
        restart: () => {
            board.resetBoard();
            playerIdx = 0;
            stateCallbacks.forEach((cb) => cb());
        },

        // clear all game's elements from dom
        destroy: () => {
            p1.destroy();
            p2.destroy();
            board.destroy();
        },

        // pass through
        getState: () => {
            let bstate = board.getState();
            let winner = null;
            if (bstate.winner === 'x') {
                winner = players[0];
            }
            else if (bstate.winner === 'o') {
                winner = players[1];
            }

            return {
                complete: bstate.complete,
                winner: winner
            };
        },

        // Declare a callback to invoke upon board being
        // clicked
        registerClickEvent: (callback) => {
            return board.boardDom.addEventListener("click", callback);
        },


        // register a callback to be invoked when
        // the game state changes in some way.
        // (this is needed eventually for AI players)
        registerStateChangeCallback: (callback) => {
            stateCallbacks.push(callback);
        },

        get player1() {
            return p1;
        },

        get player2() {
            return p2;
        },

        get boardDom() {
            return board.boardDom;
        },

        whoseTurn: () => {
            return players[playerIdx];
        }

    };
}

export {
    createBoardCell,
    createGameBoard,
    createPlayer,
    createGame
};

