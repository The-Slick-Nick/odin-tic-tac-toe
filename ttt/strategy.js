import { createGameBoard } from "./ttt.js"


/**
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
    basicAiStrategy
}
