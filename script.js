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

        cell.childNodes.forEach((child) => child.remove());

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

            // delete visual elements
            cell.childNodes.forEach((child) => child.remove());


            // ... and then create new ones
            let token = gameobj.getTokenAt(r, c);
            if (token === "x") {



                cell.classList.add("token-x");
            }
            if (token === "o") {

                let circleSvg = document.createElementNS(
                    "http://www.w3.org/2000/svg", "svg"
                );
                circleSvg.setAttribute("height", 200);
                circleSvg.setAttribute("width", 200);

                circleSvg.classList.add("token-o");

                let circleElm = document.createElementNS(
                    "http://www.w3.org/2000/svg", "circle"
                );
                circleElm.setAttribute("cx", 100);
                circleElm.setAttribute("cy", 50);
                circleElm.setAttribute("r", 40);
                circleElm.setAttribute("stroke", "black");
                circleElm.setAttribute("stroke-width", "7");
                circleElm.setAttribute("fill", "none");

                circleSvg.appendChild(circleElm);
                cell.appendChild(circleSvg);
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


