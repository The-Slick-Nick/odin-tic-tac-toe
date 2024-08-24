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

// Create and return a GameBoard object
// Take a reference to document
function createGameBoard() {

    const contents = ["", "", "", "", "", "", "", "", ""];

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

    return {
        place, resetBoard, getTokenAt, getState,
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

        executeStragegy: (board) => {
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

        // TODO: Test for game.placeToken() at already placed spot

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
        const nextPlayer = players[playerIdx];
        if (nextPlayer.strategy !== null) {

            let placement = executeStrategy(board);
            setTimeout(
                () => placeToken(nextPlayer.token, placement.row, placement.col),
                1000
            );
        }

    }

    if (p1.strategy !== null) {
        let placement = p1.executeStrategy(board);
        setTimeout(
            () => placeToken(p1.token, placement.row, placement.col),
            1000
        );
    }

    return {
        clickCell,
        restart: () => {
            board.resetBoard();
            playerIdx = 0;
            stateCallbacks.forEach((cb) => cb());
        },

        // pass through
        getState: () => {
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
                whoseTurn: whoseTurn
            };
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

        getTokenAt: (row, col) => {
            return board.getTokenAt(row, col);
        },

        whoseTurn: () => {
            return players[playerIdx];
        }

    };
}

export {
    createGameBoard,
    createPlayer,
    createGame
};

