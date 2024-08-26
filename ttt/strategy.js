import { createGameBoard } from "./ttt.js"


const bestMoveMemo = Array(59048);


function generateFingerprint(myToken, gameBoard) {

    let total = 0;
    for (let r = 0; r < gameBoard.size; r++) {
        for (let c = 0; c < gameBoard.size; c++) {
            const token = gameBoard.getTokenAt(r, c);

            total = (gameBoard.size * total) + (
                token === "" ?
                    0 :
                    token === myToken ?
                        1 :
                        2
            );
        }
    }
    return total;

}


// Assess the "score" of a particular board state
// @param boardArr - array representing a board (hypothetical or otherwise)
function calcBestMove(myToken, oppToken, gameBoard, debug = false) {

    const fingerprint = generateFingerprint(myToken, gameBoard)


    if (bestMoveMemo[fingerprint] !== undefined) {
        if (debug) {
            console.log(`Finterprint ${fingerprint} known.`);
        }
        return bestMoveMemo[fingerprint];
    }

    // const fillers = [];
    // const blockers = [];
    //
    // let nMine;
    // let nOpp;
    // let nEmpty;
    // let emptyCells;
    //
    // /*** Rows ***/
    // for (let r = 0; r < 3; r++) {
    //     nMine = nOpp = nEmpty = 0;
    //     emptyCells = [];
    //     for (let c = 0; c < 3; c++) {
    //         let idx = c + 3 * r;
    //         if (boardArr[idx] === "") {
    //             emptyCells.push([r, c]);
    //         }
    //         nEmpty += boardArr[idx] === "";
    //         nMine += boardArr[idx] === myToken;
    //         nOpp += boardArr[idx] === oppToken;
    //     }
    //
    //     if (nMine === 2 && nEmpty === 1) {
    //         emptyCells.forEach((cell) => fillers.push(cell));
    //     }
    //     else if (nOpp === 2 && nEmpty === 1) {
    //         emptyCells.forEach((cell) => blockers.push(cell));
    //     }
    // }
    //
    // /*** Columns ***/
    // for (let c = 0; c < 3; c++) {
    //     nMine = nOpp = nEmpty = 0;
    //     emptyCells = [];
    //     for (let r = 0; r < 3; r++) {
    //         let idx = c + 3 * r;
    //         if (boardArr[idx] === "") {
    //             emptyCells.push([r, c]);
    //         }
    //         nEmpty += boardArr[idx] === "";
    //         nMine += boardArr[idx] === myToken;
    //         nOpp += boardArr[idx] === oppToken;
    //     }
    //
    //     if (nMine === 2 && nEmpty === 1) {
    //         emptyCells.forEach((cell) => fillers.push(cell));
    //     }
    //     else if (nOpp === 2 && nEmpty === 1) {
    //         emptyCells.forEach((cell) => blockers.push(cell));
    //     }
    // }
    //
    // /*** Diag SE ***/
    // nMine = nOpp = nEmpty = 0;
    // emptyCells = [];
    // for (let r = 0; r < 3; r++) {
    //     let c = r;
    //     let idx = c + 3 * r;
    //     if (boardArr[idx] === "") {
    //         emptyCells.push([r, c]);
    //     }
    //     nEmpty += boardArr[idx] === "";
    //     nMine += boardArr[idx] === myToken;
    //     nOpp += boardArr[idx] === oppToken;
    // }
    //
    // if (nMine === 2 && nEmpty === 1) {
    //     emptyCells.forEach((cell) => fillers.push(cell));
    // }
    // else if (nOpp === 2 && nEmpty === 1) {
    //     emptyCells.forEach((cell) => blockers.push(cell));
    // }
    //
    // /*** Diag SW ***/
    // nMine = nOpp = nEmpty = 0;
    // emptyCells = [];
    // for (let r = 0; r < 3; r++) {
    //     let c = 2 - r;
    //     let idx = c + 3 * r;
    //     if (boardArr[idx] === "") {
    //         emptyCells.push([r, c]);
    //     }
    //     nEmpty += boardArr[idx] === "";
    //     nMine += boardArr[idx] === myToken;
    //     nOpp += boardArr[idx] === oppToken;
    // }
    //
    // if (nMine === 2 && nEmpty === 1) {
    //     emptyCells.forEach((cell) => fillers.push(cell));
    // }
    // else if (nOpp === 2 && nEmpty === 1) {
    //     emptyCells.forEach((cell) => blockers.push(cell));
    // }
    //
    //
    // if (fillers.length > 0) {
    //     bestMoveMemo[fingerprint] = [];
    //     fillers.forEach((coord) => bestMoveMemo[fingerprint].push(coord));
    //     return fillers;
    // }
    // else if (blockers.length > 0) {
    //     bestMoveMemo[fingerprint] = [];
    //     blockers.forEach((coord) => bestMoveMemo[fingerprint].push(coord));
    //     return blockers;
    // }


    let winners = [];
    let drawers = [];
    let losers = [];

    if (debug) {
        console.log(`Calculating fingerprint ${fingerprint}`);
    }
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {

            if (gameBoard.getTokenAt(r, c) !== "") {
                continue;
            }

            let boardCopy = gameBoard.copy();
            boardCopy.place(myToken, r, c);

            while (!gameBoard.getState().complete) {

                let oppMove = calcBestMove(oppToken, myToken, boardCopy)[0];
                boardCopy.place(oppToken, oppMove[0], oppMove[1]);

                if (gameBoard.getState().complete) {
                    break;
                }

                let myMove = calcBestMove(myToken, oppToken, boardCopy)[0];
                boardCopy.place(myToken, myMove[0], myMove[1]);
            }

            // game complete
            let endState = gameBoard.getState();
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

    if (winners.length > 0) {
        bestMoveMemo[fingerprint] = winners;
    }
    else if (drawers.length > 0) {
        bestMoveMemo[fingerprint] = drawers;
    }
    else {
        bestMoveMemo[fingerprint] = losers;
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

const basicAiStrategy = createWeightedStrategy(1, 3, 2);

export {
    createWeightedStrategy,
    basicAiStrategy,
    calcBestMove
}
