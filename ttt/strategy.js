import { createGameBoard } from "./ttt.js"

/******************************************************************************
 * Helpers/utilities
******************************************************************************/

const bestMoveMemo = Array(60000); // upper bound of possible states

// Assess the "score" of a particular board state
// @param boardArr - array representing a board (hypothetical or otherwise)

/**
 * @brief Assess and return a list of the best possible moves from a given
 *        gameboard
 * @param myToken - string token ("x" or "o") representing caller's piece
 * @param oppToken - string token ("x" or "o") representing opponent's piece
 * @param gameBoard - gameBoard object representing current board state.
 * @param debug - Boolean flag determining if extra information is printed
 */
function calcBestMove(myToken, oppToken, gameBoard, debug = false) {

    if (debug) {
        console.log("-".repeat(80));
    }

    const fingerprint = gameBoard.exportFingerprint(myToken);


    if (bestMoveMemo[fingerprint] !== undefined) {
        if (debug) {
            console.log(`Fingerprint ${fingerprint} known.`);
            console.log("-".repeat(80));
        }
        return bestMoveMemo[fingerprint];
    }

    let winners = [];
    let drawers = [];
    let losers = [];

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {

            if (gameBoard.getTokenAt(r, c) !== "") {
                continue;
            }

            let boardCopy = gameBoard.copy();
            boardCopy.place(myToken, r, c);

            while (!boardCopy.getState().complete) {

                let oppMove = calcBestMove(oppToken, myToken, boardCopy, debug)[0];
                boardCopy.place(oppToken, oppMove[0], oppMove[1]);


                if (boardCopy.getState().complete) {
                    break;
                }

                let myMove = calcBestMove(myToken, oppToken, boardCopy, debug)[0];
                boardCopy.place(myToken, myMove[0], myMove[1]);
            }

            // game complete
            let endState = boardCopy.getState();

            if (endState.winner === myToken) {
                winners.push([r, c]);
            }
            else if (endState.winner === oppToken) {
                losers.push([r, c]);
            }
            else {
                drawers.push([r, c]);
            }
        }
    }

    if (debug) {
        console.log(`From board with token ${myToken}:`)
        gameBoard.printBoard();
        console.log("winners");
        console.log(winners);

        console.log("drawers");
        console.log(drawers);

        console.log("losers");
        console.log(losers);
    }

    if (winners.length > 0) {
        bestMoveMemo[fingerprint] = winners;
    }
    else if (drawers.length > 0) {
        bestMoveMemo[fingerprint] = drawers;
    }
    else {
        bestMoveMemo[fingerprint] = losers;
    }
    if (debug) {
        console.log("returning a moveset:");
        console.log(bestMoveMemo[fingerprint]);
        console.log("-".repeat(80));
    }
    return bestMoveMemo[fingerprint];
}


/**
 * @brief - Create a strategy using weights to determine how to play.
 *          Note that this will not create an optimal strategy - this factory
 *          allows for creating AI of varying difficulty, but it will
 *          never play perfect under this algorithm
 *
 * @param winW - Weight per number of wins a cell contributes to
 * @param myW - Weight given per instance of "my" token
 * @param oppW - Weight given per isntance of opponent token
 */
function createWeightedStrategy(winW, myW, oppW, tiebreaker = null) {

    if (tiebreaker === null) {
        tiebreaker = (arr) => {
            if (arr.length === 0) {
                return null;
            }
            return arr[0]
        }
    }


    const strat = (token, board, debug = false) => {

        const rowWs = [];
        const colWs = [];
        let diagSeW = 0;
        let diagSwW = 0;


        // preprocess base scores
        for (let r = 0; r < board.size; r++) {
            rowWs[r] = winW;
        }
        for (let c = 0; c < board.size; c++) {
            colWs[c] = winW;
        }
        diagSeW = winW;
        diagSwW = winW;


        // Combo bonuses
        // row
        for (let r = 0; r < board.size; r++) {
            let basis = "";
            let comboCount = 0;
            for (let c = 0; c < board.size; c++) {

                const boardToken = board.getTokenAt(r, c);
                if (boardToken === "") {
                    continue;
                }

                if (basis === "") {
                    basis = boardToken;
                    comboCount = 1;
                }
                else if (basis !== boardToken) {
                    comboCount = 0;
                    break;
                }
                else {
                    comboCount++;
                }
            }

            let comboW = (
                basis === "" ?
                    1 :
                    basis === token ?
                        myW * comboCount * (comboCount + 1) / 2 :
                        oppW * comboCount * (comboCount + 1) / 2
            );
            rowWs[r] += comboW;
        }

        // col
        for (let c = 0; c < board.size; c++) {
            let basis = "";
            let comboCount = 0;
            for (let r = 0; r < board.size; r++) {
                const boardToken = board.getTokenAt(r, c);
                if (boardToken === "") {
                    continue;
                }

                if (basis === "") {
                    basis = boardToken;
                    comboCount = 1;
                }
                else if (basis === boardToken) {
                    comboCount++;
                }
                else {
                    comboCount = 0;
                    break;
                }
            }
            let comboW = (
                basis === "" ?
                    1 :
                    basis === token ?
                        myW * comboCount * (comboCount + 1) / 2 :
                        oppW * comboCount * (comboCount + 1) / 2
            );
            colWs[c] += comboW;
        }

        // diag se
        {
            let basis = "";
            let comboCount = 0;

            for (let r = 0; r < board.size; r++) {
                let c = r;
                const boardToken = board.getTokenAt(r, c);

                if (boardToken === "") {
                    continue;
                }

                if (basis === "") {
                    basis = boardToken;
                    comboCount = 1;
                }
                else if (basis === boardToken) {
                    comboCount++;
                }
                else {
                    comboCount = 0;
                    break;
                }
            }
            let comboW = (
                basis === "" ?
                    1 :
                    basis === token ?
                        myW * comboCount * (comboCount + 1) / 2 :
                        oppW * comboCount * (comboCount + 1) / 2
            );
            diagSeW += comboW;
        }

        // diag sw
        {
            let basis = "";
            let comboCount = 0;

            for (let r = 0; r < board.size; r++) {
                let c = board.size - 1 - r;
                const boardToken = board.getTokenAt(r, c);

                if (boardToken === "") {
                    continue;
                }

                if (basis === "") {
                    basis = boardToken;
                    comboCount = 1;
                }
                else if (basis === boardToken) {
                    comboCount++;
                }
                else {
                    comboCount = 0;
                    break;
                }
            }
            let comboW = (
                basis === "" ?
                    1 :
                    basis === token ?
                        myW * comboCount * (comboCount + 1) / 2 :
                        oppW * comboCount * (comboCount + 1) / 2
            );
            diagSwW += comboW;
        }


        // postprocess
        let bestW = -1;
        let bestCells = [];  // to be returned

        for (let r = 0; r < board.size; r++) {
            for (let c = 0; c < board.size; c++) {

                let cellW = (
                    rowWs[r]
                    + colWs[c]
                    + (r === c ? diagSeW : 0)
                    + (r === (board.size - 1 - c) ? diagSwW : 0)
                );

                if (debug) {
                    console.log(`(${r}, ${c}) = ${cellW}`);

                }

                // can't choose somewhere already placed
                if (board.getTokenAt(r, c) !== "") {
                    continue;
                }

                if (cellW === bestW) {
                    bestCells.push([r, c]);
                }
                else if (cellW > bestW) {
                    bestW = cellW;
                    bestCells = [[r, c]];
                }

            }
        }

        return tiebreaker(bestCells);
    };

    return strat;

}

/******************************************************************************
 * Strategies
******************************************************************************/

const mediumAiStrategy = createWeightedStrategy(1, 3, 2);

const hardAiStrategy = (token, board) => {

    // yields a list of equally good moves
    const moveList = calcBestMove(token, token === "x" ? "o" : "x", board);

    if (moveList.length === 0) {
        throw new Error("No move could be calculated");
    }

    return moveList[Math.floor(Math.random() * moveList.length)];
};

export {
    createWeightedStrategy,
    mediumAiStrategy,
    hardAiStrategy,
    calcBestMove
}
