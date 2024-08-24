import { createPlayer, createGame } from "./ttt/ttt.js"

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

    p1 = createPlayer(p1Input.value, "x");
    p2 = createPlayer(p2Input.value, "o");
    gameobj = createGame(p1, p2);

    gameobj.registerStateChangeCallback(() => updateStatus(gameobj));

    document.querySelectorAll(".board-cell").forEach((cell) => {

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

        cell.addEventListener("click", () => {
            console.log(`Clicked ${r}, ${c}`);
            gameobj.clickCell(r, c);
        });


        gameobj.registerStateChangeCallback(() => {
            cell.classList.remove("token-x");
            cell.classList.remove("token-o");
            let token = gameobj.getTokenAt(r, c);
            if (token === "x") {
                cell.classList.add("token-x");
            }
            if (token === "o") {
                cell.classList.add("token-o");
            }
        });
    });
}

setup();
updateStatus(gameobj);
newGameBtn.addEventListener("click", setup);


document.querySelector(".reset-btn").addEventListener("click", (e) => {
    statusLbl.innerText = "";
    gameobj.restart();
    updateStatus(gameobj);
});


