
import { createBoardCell, createPlayer, createGame, createGameBoard } from "./ttt.js"

// mock a classList
function createClassListMock() {

    const classes = [];

    return {
        add: (cls) => classes.push(cls),
        contains: (cls) => classes.indexOf(cls) !== -1,
        remove: (cls) => {
            let idx = classes.indexOf(cls);
            if (idx !== -1) {
                return classes.splice(idx);
            }
        },
        toggle: (cls) => {
            let idx = classes.indexOf(cls);
            if (idx === -1) {
                return classes.push(cls);
            }
            else {
                return classes.splice(idx);
            }
        },
        join: (delim) => classes.join(delim)
    };
}

// mock a javascript-represented dom element
function createDomMock() {

    const classList = createClassListMock();
    const children = [];

    return {
        classList: classList,
        get className() { return classList.join(" "); },
        get children() { return children; },
        appendChild: (child) => children.push(child),
        removeChild: (child) => {
            let idx = children.indexOf(child);
            if (idx !== -1) {
                return children.splice(idx)[0];
            }
        },
        remove: () => { }
    };
}

// mock the document object
function createDocMock() {

    return {
        createElement: (elm) => createDomMock(),
        querySelector: (qry) => createDomMock()

    };

}


/* Test our tests just to be sure */
describe("Test Mocks", () => {
    test("Add to classList", () => {
        let testList = createClassListMock();
        testList.add("hello");
        expect(testList.contains("hello")).toBe(true);
    }),

        test("Remove from classList", () => {
            let testList = createClassListMock();
            testList.add("hello");
            testList.remove("hello");
            expect(testList.contains("hello")).toBe(false);
        }),

        test("Toggle classList", () => {
            let testList = createClassListMock();
            testList.toggle("hello");
            expect(testList.contains("hello")).toBe(true);
            testList.toggle("hello");
            expect(testList.contains("hello")).toBe(false);
        }),

        test("Test removeChild", () => {
            let parent = createDomMock();
            parent.classList.add("parent");

            let child = createDomMock();
            child.classList.add("child");

            parent.appendChild(child);
            let output = parent.removeChild(child);
            expect(output.className).toEqual(child.className);
        }),

        test("Test className", () => {
            let dom = createDomMock();
            dom.classList.add("one");
            dom.classList.add("two");
            expect(dom.className).toEqual("one two");
        })

});

describe("Test Board Cell", () => {

    test("Destroy", () => {
        const cell = createBoardCell(createDocMock(), 0, 0);
        cell.destroy();
        expect(cell.cellDom).toBe(null);
    }),

        test("Place a token", () => {
            const doc = createDocMock();
            const testCell = createBoardCell(doc, 0, 0);

            testCell.placeToken("x");
            expect(testCell.token).toEqual("x");
        }),

        test("No token", () => {
            const doc = createDocMock();
            const testCell = createBoardCell(doc, 0, 0);
            expect(testCell.token).toEqual("");
        }),

        test("Get row", () => {
            const doc = createDocMock();
            const testCell = createBoardCell(doc, 1, 2);
            expect(testCell.row).toEqual(1);
        }),

        test("Get col", () => {
            const doc = createDocMock();
            const testCell = createBoardCell(doc, 1, 2);
            expect(testCell.col).toEqual(2);
        })
});

describe("Test Board Object", () => {

    test("Destroy", () => {

        const board = createGameBoard(createDocMock());

        board.destroy();
        expect(board.boardDom).toBe(null);

    }),

        test("Place token", () => {
            const board = createGameBoard(createDocMock());
            board.place("x", 1, 1);
            const state = board.getState();
            expect(state).toStrictEqual({
                complete: false,
                winner: ""
            });
        }),

        test("Tie Game", () => {
            const board = createGameBoard(createDocMock());
            /* x x o
             * o o x
             * x x o
             */
            board.place("x", 0, 0);
            board.place("x", 0, 1);
            board.place("o", 0, 2);
            board.place("o", 1, 0);
            board.place("o", 1, 1);
            board.place("x", 1, 2);
            board.place("x", 2, 0);
            board.place("x", 2, 1);
            board.place("o", 2, 2);

            const state = board.getState();
            expect(state).toStrictEqual({
                complete: true,
                winner: ""
            });
        }),

        test("Clear board", () => {

            // create it
            const board = createGameBoard(createDocMock());

            // fill it
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board.place("x", r, c);
                }
            }

            // clear it
            board.resetBoard();

            const state = board.getState();
            expect(state).toStrictEqual({
                complete: false,
                winner: ""
            });
        }),

        test("Rows complete", () => {
            // Fill rows and check state

            const board = createGameBoard(createDocMock());

            // make sure both tokens can win
            ["x", "o"].forEach((token) => {
                for (let r = 0; r < 3; r++) {
                    board.resetBoard();
                    for (let c = 0; c < 3; c++) {
                        board.place(token, r, c);
                    }
                    const state = board.getState();
                    expect(state).toStrictEqual({
                        complete: true,
                        winner: token
                    });
                }
            });
        }),

        test("Columns complete", () => {
            // Fill columns and check state

            const board = createGameBoard(createDocMock());

            // make sure both tokens can win
            ["x", "o"].forEach((token) => {
                for (let c = 0; c < 3; c++) {
                    board.resetBoard();
                    for (let r = 0; r < 3; r++) {
                        board.place(token, r, c);
                    }
                    const state = board.getState();
                    expect(state).toStrictEqual({
                        complete: true,
                        winner: token
                    });
                }
            });
        }),

        test("Diagonals complete", () => {
            // Fill diagonals and check state

            const board = createGameBoard(createDocMock());

            ["x", "o"].forEach((token) => {

                // se
                board.resetBoard();
                for (let r = 0; r < 3; r++) {
                    board.place(token, r, r);
                }
                let state = board.getState();
                expect(state).toStrictEqual({
                    complete: true,
                    winner: token
                });

                // sw
                board.resetBoard();
                for (let r = 0; r < 3; r++) {
                    board.place(token, r, 2 - r);
                }
                state = board.getState();
                expect(state).toStrictEqual({
                    complete: true,
                    winner: token
                });
            });
        }),

        test("Get cell elem", () => {

            const board = createGameBoard(createDocMock());
            board.place("x", 0, 0);
            board.place("o", 1, 1);

            const xDom = board.boardDom.children[0];
            const xcell = board.getCellFromDom(xDom);
            expect(xcell.row).toEqual(0);
            expect(xcell.col).toEqual(0);
            expect(xcell.token).toEqual("x");

            const oDom = board.boardDom.children[4];
            const ocell = board.getCellFromDom(oDom);
            expect(ocell.row).toEqual(1);
            expect(ocell.col).toEqual(1);
            expect(ocell.token).toEqual("o");

        })
});



export {
    createDocMock,
    createDomMock,
    createClassListMock
};
