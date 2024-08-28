/*
 * ttt.js
 *
 * Tic-Tac-Toe game
 */

/**
 * @brief Create game board object
 */
function createGameBoard() {

    const size = 3;
    const contents = [];
    for (let i = 0; i < size * size; i++) {
        contents.push("");
    }


    // place X or O in board. Return 0 if successful placement, or -1
    // if placement invalid
    function place(token, row, column) {
        let idx = column + 3 * row;
        contents[idx] = token;
    }

    function getTokenAt(row, column) {
        let idx = column + 3 * row;
        return contents[idx];
    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            contents[i] = "";
        }
    }

    // Assess the state of the game board
    // Returns an object with:
    //     complete: boolean - is the game over
    //     winner: winning token, if any. If nobody won, empty string
    //     winPath: array of [row, col] indices, if a winner was found
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
                    winner: basis,
                    winPath: [[ckRow, 0], [ckRow, 1], [ckRow, 2]]
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
                    winner: basis,
                    winPath: [[0, ckCol], [1, ckCol], [2, ckCol]]
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
                    winner: basis,
                    winPath: [[0, 0], [1, 1], [2, 2]]
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
                    winner: basis,
                    winPath: [[0, 2], [1, 1], [2, 0]]
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
            winner: "",
            winPath: []
        };
    }

    function copy() {

        let newBoard = createGameBoard();
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                let idx = c + r * size;

                if (contents[idx] !== "") {
                    newBoard.place(contents[idx], r, c);
                }

            }
        }
        return newBoard;
    }

    function exportFingerprint(basisToken) {

        let total = 0;
        for (let i = 0; i < size * size; i++) {

            total = (total * 3) + (
                contents[i] === "" ? 0 :
                    contents[i] === basisToken ? 1 : 2
            );


        }
        return total;
    }

    function importFingerprint(fingerprint, basisToken, otherToken) {

        // for (let i = 0; i < size * size; i++) {
        for (let i = size * size - 1; i >= 0; i--) {

            let code = fingerprint % 3;
            if (code === 0) {
                contents[i] = "";
            }
            else if (code === 1) {
                contents[i] = basisToken;
            }
            else {
                contents[i] = otherToken;
            }

            fingerprint = (fingerprint - code) / 3;
        }
    }

    function printBoard(topBorder = false, bottomBorder = false) {

        if (topBorder) {
            console.log("-".repeat(80));
        }

        for (let r = 0; r < size; r++) {
            let printstr = "";
            for (let c = 0; c < size; c++) {
                printstr += getTokenAt(r, c) + ", ";
            }
            console.log(printstr);
        }

        if (bottomBorder) {
            console.log("-".repeat(80));
        }
    }

    return {
        get size() { return size; },
        place, resetBoard, getTokenAt, getState, copy,
        exportFingerprint, importFingerprint,
        printBoard
    };
}



/**
 * Create a player object
 *
 * @param name - String name used to refer to player. Musn't be empty
 * @param token - Single character token player will use. "x" or "o"
 * @param strategy - Default "" - Function taking a gameBoard object and
 *                   returning a chosen location to play a token. If "",
 *                   defaults to waiting for human input
 */
function createPlayer(name, token, strategy = null) {
    let wins = 0;
    let losses = 0;

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

    function setToken(newToken) {
        token = newToken;
    }

    function getToken() {
        return token;
    }


    return {
        getWins, getLosses, win, lose, setToken, getToken,
        strategy,
        get token() {
            return token;
        },
        get name() {
            return name;
        },
        get wins() {
            return wins;
        },
        get losses() {
            return losses;
        },
        get isHuman() {
            return strategy === null;
        },

        executeStrategy: (board) => {
            return strategy(token, board);
        }

    };
}


function createGame(p1, p2) {

    if (
        p1.token === p2.token
        ||
        (p1.token !== 'x' && p1.token !== 'o')
        ||
        (p2.token !== 'o' && p2.token !== 'o')
    ) {
        throw new Error(
            `Invalid player token config ${p1.token}, ${p2.token}`
        );
    }

    const board = createGameBoard();

    const stateCallbacks = [];
    const players = [p1, p2];
    let playerIdx = 0;

    // Kick-off game - resets if not already running
    function start() {

        board.resetBoard();
        playerIdx = 0;
        stateCallbacks.forEach((cb) => cb());

        const firstPlayer = players[playerIdx];
        if (firstPlayer.strategy !== null) {
            let placement = firstPlayer.executeStrategy(board);
            let token = firstPlayer.token;

            setTimeout(
                () => placeToken(
                    token, placement[0], placement[1]
                ),
                1000
            );
        }
    }

    function clickCell(row, col) {
        // The "click" to come from an external listener

        const currentPlayer = players[playerIdx];
        if (currentPlayer.strategy !== null) {
            // ai 
            return;
        }

        if (board.getTokenAt(row, col) !== "") {
            return;
        }

        placeToken(currentPlayer.token, row, col);

    }

    function placeToken(token, row, col) {

        if (board.getState().complete) {
            return;
        }

        if (token === "") {
            return;
        }

        if (whoseTurn().token !== token) {
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

        playerIdx = (playerIdx + 1) % players.length;

        stateCallbacks.forEach((cb) => { cb(); });

        if (board.getState().complete) {
            return;
        }

        // Schedule future turn

        const nextPlayer = players[playerIdx];
        if (nextPlayer.strategy !== null) {

            let placement = nextPlayer.executeStrategy(board);
            let token = nextPlayer.token;

            setTimeout(
                () => placeToken(token, placement[0], placement[1]),
                1000
            );
        }
    }

    function getState() {
        let bstate = board.getState();
        let winner = null;
        players.forEach((player) => {
            if (player.token === bstate.winner) {
                winner = player;
            }
        });

        let whoseTurn = bstate.complete ? null : players[playerIdx];
        return {
            complete: bstate.complete,
            winner: winner,
            whoseTurn: whoseTurn,
            winPath: bstate.winPath
        };
    }

    // register a callback to be invoked when
    // the game state changes in some way.
    // (this is needed eventually for AI players)
    function registerStateChangeCallback(callback) {
        stateCallbacks.push(callback);

    }

    function getTokenAt(row, col) {
        return board.getTokenAt(row, col);
    }

    function whoseTurn() {
        return players[playerIdx];
    }

    start();

    return {
        clickCell,
        start,
        registerStateChangeCallback,
        getState,
        getTokenAt,
        whoseTurn,
        get player1() { return p1; },
        get player2() { return p2; }
    };
}

export {
    createGameBoard,
    createPlayer,
    createGame
};

