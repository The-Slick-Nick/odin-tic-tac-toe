import { createBoardCell, createGameBoard, createPlayer, runGame } from "./ttt/ttt.js"



const boardTarget = document.querySelector(".gameboard-container");
const labelTarget = document.querySelector(".label-container");

runGame(document, boardTarget, labelTarget);

