import { createPlayer, createGame } from "./ttt/ttt.js"
import { mediumAiStrategy, hardAiStrategy } from "./ttt/strategy.js";

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

    p1 = createPlayer(p1Input.value, "x", hardAiStrategy);
    p2 = createPlayer(p2Input.value, "o", mediumAiStrategy);
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


        // Token addition/removal
        gameobj.registerStateChangeCallback(() => {

            let token = gameobj.getTokenAt(r, c);

            if (token === "") {
                cell.childNodes.forEach((child) => child.remove());
                return;
            }

            let tokenCls = `token-${token}`;
            for (let child of cell.childNodes) {
                if (child.classList.contains(tokenCls)) {
                    return;
                }
            }

            if (token === "x") {

                let xSvg = document.createElementNS(
                    "http://www.w3.org/2000/svg", "svg"
                );
                let xPath = document.createElementNS(
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
}

setup();
updateStatus(gameobj);
newGameBtn.addEventListener("click", setup);


document.querySelector(".reset-btn").addEventListener("click", (e) => {
    statusLbl.innerText = "";
    gameobj.start();
    updateStatus(gameobj);
});


