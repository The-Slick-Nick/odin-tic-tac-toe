import { createBoardCell, createGameBoard, createPlayer, createGame } from "./ttt/ttt.js"

const boardTarget = document.querySelector(".gameboard-container");
const labelTarget = document.querySelector(".label-container");

const statusLbl = document.querySelector(".status-lbl");



const p1Input = document.querySelector("#firstplayer-name");
const p2Input = document.querySelector("#secondplayer-name");
const newGameBtn = document.querySelector(".options-submit");


let p1 = null;
let p2 = null;
let gameobj = null;


function updateStatus(game) {
    let state = game.getState();
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
        lbltext = game.whoseTurn().name;
    }
    statusLbl.innerText = lbltext;
}

function setup() {

    if (null !== p1) {
        p1.destroy();
    }

    if (null !== p2) {
        p2.destroy();
    }

    if (null !== gameobj) {
        gameobj.destroy();
    }

    p1 = createPlayer(document, p1Input.value, "x");
    p2 = createPlayer(document, p2Input.value, "o");
    gameobj = createGame(document, p1, p2, boardTarget);

    gameobj.registerStateChangeCallback(() => updateStatus(gameobj));
}

setup();
updateStatus(gameobj);
newGameBtn.addEventListener("click", setup);


document.querySelector(".reset-btn").addEventListener("click", (e) => {
    statusLbl.innerText = "";
    gameobj.restart();
    updateStatus(gameobj);
});


