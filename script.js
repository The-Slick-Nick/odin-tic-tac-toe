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

// TODO: 
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

                let xSvg = document.createElementNS(
                    "http://www.w3.org/2000/svg", "svg"
                );
                let xPath = document.createElementNS(
                    "http://www.w3.org/2000/svg", "path"
                );

                xSvg.setAttribute("viewBox", "0 0 500 500");  // important
                xSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                xSvg.classList.add("token-x");

                xPath.setAttribute(
                    "d", "M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                );
                xPath.setAttribute("stroke", "black");

                xSvg.appendChild(xPath);
                cell.appendChild(xSvg);
                cell.classList.add("token-x");
            }
            if (token === "o") {

                let circleSvg = document.createElementNS(
                    "http://www.w3.org/2000/svg", "svg"
                );

                circleSvg.classList.add("token-o");

                let circleElm = document.createElementNS(
                    "http://www.w3.org/2000/svg", "circle"
                );
                circleElm.setAttribute("cx", 50);
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


