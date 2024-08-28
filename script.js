import { createPlayer, createGame } from "./ttt/ttt.js"
import { easyAiStrategy, mediumAiStrategy, hardAiStrategy } from "./ttt/strategy.js";


/******************************************************************************
 * Script globals
******************************************************************************/

// labels
const statusLbl = document.querySelector(".status-lbl");

const xScoreNameLbl = document.querySelector(".scorelbl-name.x");
const xScoreValueLbl = document.querySelector(".scorelbl-value.x");

const oScoreNameLbl = document.querySelector(".scorelbl-name.o");
const oScoreValueLbl = document.querySelector(".scorelbl-value.o");

// buttons
const boardCells = document.querySelectorAll(".board-cell");
const newGameBtn = document.querySelector(".options-submit");
const resetBtn = document.querySelector(".reset-btn");
const optionsToggle = document.querySelector(".game-options-toggle");


const toggleArrowPath = document.querySelector(".toggle-arrow>path");
const optionsBody = document.querySelector(".game-options-body");



let p1 = null;
let p2 = null;
let gameobj = null;


/******************************************************************************
 * Function utilities
******************************************************************************/

// Update the various status elements (labels and the like)
function updateStatus() {
    let state = gameobj.getState();
    let lbltext = "";

    if (state.complete) {
        if (state.winner === null) {
            lbltext = "Tie!";
        }
        else {
            lbltext = `${state.winner.name} wins!`;
        }
    }
    else {
        lbltext = `${gameobj.whoseTurn().name}'s turn`;
    }
    statusLbl.innerText = lbltext;

    xScoreNameLbl.innerText = gameobj.player1.name;
    xScoreValueLbl.innerText = gameobj.player1.wins;

    oScoreNameLbl.innerText = gameobj.player2.name;
    oScoreValueLbl.innerText = gameobj.player2.wins;
}


function clickCell(r, c) {

    // By wrapping this in a function call, we can map clicks to whatever
    // the current game object is at function call, rather than to the object
    // reference at event-listener declaration
    gameobj.clickCell(r, c);
}

// set up game based on option values
function setup() {

    // options
    const p1Input = document.querySelector("#firstplayer-name");
    const p2Input = document.querySelector("#secondplayer-name");

    // values
    const xInputScheme = document.querySelector(
        'input[name="x-input-scheme"]:checked');

    const oInputScheme = document.querySelector(
        'input[name="o-input-scheme"]:checked');


    const xStrategy = (
        xInputScheme.value === "easy-ai" ? easyAiStrategy :
            xInputScheme.value === "medium-ai" ? mediumAiStrategy :
                xInputScheme.value === "hard-ai" ? hardAiStrategy :
                    null
    );

    const oStrategy = (
        oInputScheme.value === "easy-ai" ? easyAiStrategy :
            oInputScheme.value === "medium-ai" ? mediumAiStrategy :
                oInputScheme.value === "hard-ai" ? hardAiStrategy :
                    null
    );

    p1 = createPlayer(p1Input.value, "x", xStrategy);
    p2 = createPlayer(p2Input.value, "o", oStrategy);


    gameobj = createGame(p1, p2);

    gameobj.registerStateChangeCallback(() => updateStatus(gameobj));

    boardCells.forEach((cell) => {
        const r = parseInt(
            cell
                .className
                .split(" ")
                .filter((cls) => cls.startsWith("row-"))
            [0]
                .split("-")
            [1]
        );

        const c = parseInt(
            cell
                .className
                .split(" ")
                .filter((cls) => cls.startsWith("col-"))
            [0]
                .split("-")
            [1]
        );

        // clear existing tokens
        cell.childNodes.forEach((child) => child.remove());

        // set up automated token creation
        gameobj.registerStateChangeCallback(() => {

            const token = gameobj.getTokenAt(r, c);

            // remove if not empty - likely will never trigger?
            if (token === "") {
                cell.childNodes.forEach((child) => child.remove());
                return;
            }

            // check existing
            const tokenCls = `token-${token}`;
            for (let child of cell.childNodes) {
                if (child.classList.contains(tokenCls)) {
                    return;
                }
            }

            // add new
            if (token === "x") {

                const xSvg = document.createElementNS(
                    "http://www.w3.org/2000/svg", "svg"
                );
                const xPath = document.createElementNS(
                    "http://www.w3.org/2000/svg", "path"
                );

                xSvg.setAttribute("viewBox", "0 0 100 100");  // important
                xSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                xSvg.classList.add("token-x");

                xPath.setAttribute(
                    "d",
                    "m0,15 l15,-15 l85,85 l-15,15 m-85,-15 l85,-85 l15,15 l-85,85 z"
                );

                xPath.setAttribute("stroke", "black");

                xSvg.appendChild(xPath);
                cell.appendChild(xSvg);
            }
            if (token === "o") {

                let oSvg = document.createElementNS(
                    "http://www.w3.org/2000/svg", "svg"
                );

                oSvg.setAttribute("viewBox", "0 0 100 100");
                oSvg.setAttribute("xmlns", "https://www.w3.org/2000/svg");
                oSvg.classList.add("token-o");

                let oPath = document.createElementNS(
                    "http://www.w3.org/2000/svg", "path"
                );
                oPath.setAttribute(
                    "d",
                    "m49.5,0 a49,49,0,1,0,1,0 z m0,20 a30,30,0,1,1,-1,0 z"
                );
                oPath.setAttribute("stroke", "black");

                oSvg.appendChild(oPath);
                cell.appendChild(oSvg);
            }
        });

        // Token coloration depending on state
        gameobj.registerStateChangeCallback(() => {

            let state = gameobj.getState();

            if (!state.complete) {
                return;
            }

            // tie - no winner
            if (state.winner === null) {
                cell.childNodes.forEach((child) => {
                    child.classList.remove("winner");
                    child.classList.add("loser");
                });
                return;
            }

            if (!state.complete) {
                console.log("Nothing to do...");
                return;
            }


            state.winPath.forEach((coord) => {
                if (coord[0] !== r || coord[1] !== c) {
                    return;
                }

                cell.childNodes.forEach((child) => {
                    child.classList.remove("loser");
                    child.classList.add("winner");
                });
            });
        });

    });

    gameobj.registerStateChangeCallback(() => {

        const state = gameobj.getState();

        if (state.complete) {
            resetBtn.classList.remove("hidden");
        }
    });

    gameobj.registerStateChangeCallback(updateStatus);

}

// Toggle the options pane in/out
function toggleOptionVisibility() {

    if (optionsBody.classList.contains("collapsed-h")) {

        optionsBody.classList.remove("collapsed-h");
        toggleArrowPath.setAttribute("d", "m100,0 l-100,50 l100,50 z");

    }
    else {
        optionsBody.classList.add("collapsed-h");
        toggleArrowPath.setAttribute("d", "m0,0 l100,50 l-100,50 z");
    }

}

/******************************************************************************
 * Adding button logic
******************************************************************************/

// Hook board inputs into game logic
boardCells.forEach((cell) => {
    // Note: this is done here rather than in setup() to avoid "stacking"
    // multiple event listeners on a cell when new games are set up.

    let r = parseInt(
        cell
            .className
            .split(" ")
            .filter((cls) => cls.startsWith("row-"))
        [0]
            .split("-")
        [1]
    );

    let c = parseInt(
        cell
            .className
            .split(" ")
            .filter((cls) => cls.startsWith("col-"))
        [0]
            .split("-")
        [1]
    );

    cell.addEventListener("click", () => clickCell(r, c));
});


// Start a new game
newGameBtn.addEventListener("click", () => {
    setup();
    toggleOptionVisibility();
    updateStatus();
});


// Start a new round
resetBtn.addEventListener("click", (e) => {

    resetBtn.classList.add("hidden");
    statusLbl.innerText = "";
    gameobj.start();  // restarts
    updateStatus();
});


// Expand/collapse options menu
optionsToggle.addEventListener("click", toggleOptionVisibility);


/******************************************************************************
 * Kicking things off
******************************************************************************/
setup();
updateStatus();




