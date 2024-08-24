import { createBoardCell, createGameBoard, createPlayer, createGame } from "./ttt/ttt.js"

const boardTarget = document.querySelector(".gameboard-container");
const labelTarget = document.querySelector(".label-container");
let gameobj = createGame(document, boardTarget, labelTarget);

document.querySelector(".reset-btn").addEventListener("click", (e) => {

    gameobj.restart();


});



