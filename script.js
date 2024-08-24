import { createBoardCell, createGameBoard, createPlayer, createGame } from "./ttt/ttt.js"

const boardTarget = document.querySelector(".gameboard-container");
const labelTarget = document.querySelector(".label-container");

const p1Input = document.querySelector("#firstplayer-name");
const p2Input = document.querySelector("#secondplayer-name");
const newGameBtn = document.querySelector(".options-submit");

let p1 = null;
let p2 = null;
let gameobj = null;

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
    gameobj = createGame(document, p1, p2, boardTarget, labelTarget);
}

setup();
newGameBtn.addEventListener("click", setup);


document.querySelector(".reset-btn").addEventListener("click", (e) => {
    gameobj.restart();
});


