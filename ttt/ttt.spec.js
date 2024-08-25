
import { createPlayer, createGame, createGameBoard } from "./ttt.js"


/******************************************************************************
 * Mocks
******************************************************************************/

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

/******************************************************************************
 * Tests
******************************************************************************/


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


describe("Test Board Object", () => {

    test("Place token", () => {
        const board = createGameBoard();
        board.place("x", 1, 1);
        const state = board.getState();
        expect(state).toStrictEqual({
            complete: false,
            winner: "",
            winPath: []
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
                winner: "",
                winPath: []
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
                winner: "",
                winPath: []
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
                        winner: token,
                        winPath: [[r, 0], [r, 1], [r, 2]]
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
                        winner: token,
                        winPath: [[0, c], [1, c], [2, c]]

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
                    winner: token,
                    winPath: [[0, 0], [1, 1], [2, 2]]
                });

                // sw
                board.resetBoard();
                for (let r = 0; r < 3; r++) {
                    board.place(token, r, 2 - r);
                }
                state = board.getState();
                expect(state).toStrictEqual({
                    complete: true,
                    winner: token,
                    winPath: [[0, 2], [1, 1], [2, 0]]
                });
            });
        })
});



describe("Test Game Object", () => {

    test("Place token", () => {

        const p1 = createPlayer("p1", "x");
        const p2 = createPlayer("p2", "o");
        const game = createGame(p1, p2);

        game.clickCell(1, 1);

        const state = game.getState();
        expect(state).toEqual({
            complete: false,
            winner: null,
            whoseTurn: p2,
            winPath: []
        });

        const token = game.getTokenAt(1, 1);
        expect(token).toEqual("x");
    }),

        test("Place multiple", () => {
            const p1 = createPlayer("p1", "x");
            const p2 = createPlayer("p2", "o");
            const game = createGame(p1, p2);

            game.clickCell(1, 1);
            game.clickCell(0, 0);

            const state = game.getState();
            expect(state).toEqual({
                complete: false,
                winner: null,
                whoseTurn: p1,
                winPath: []
            });

            expect(game.getTokenAt(1, 1)).toEqual("x");
            expect(game.getTokenAt(0, 0)).toEqual("o");
        }),

        test("Attempt overwrite", () => {
            const p1 = createPlayer("p1", "x");
            const p2 = createPlayer("p2", "o");
            const game = createGame(p1, p2);

            game.clickCell(1, 1);
            game.clickCell(1, 1);

            const state = game.getState();
            expect(state).toEqual({
                complete: false,
                winner: null,
                whoseTurn: p2,  // didn't cycle
                winPath: []
            });

            expect(game.getTokenAt(1, 1)).toEqual("x");
        }),

        test("A winner", () => {
            const p1 = createPlayer("p1", "x");
            const p2 = createPlayer("p2", "o");
            const game = createGame(p1, p2);

            game.clickCell(0, 0);
            game.clickCell(1, 0);

            game.clickCell(0, 1);
            game.clickCell(1, 1);

            game.clickCell(0, 2);
            game.clickCell(1, 2);  // shouldn't register

            const state = game.getState();
            expect(state).toEqual({
                complete: true,
                winner: p1,
                whoseTurn: null,
                winPath: [[0, 0], [0, 1], [0, 2]]
            });
        }),

        test("Tie game", () => {
            const p1 = createPlayer("p1", "x");
            const p2 = createPlayer("p2", "o");
            const game = createGame(p1, p2);

            /* x x o
             * o o x
             * x x o
             */
            game.clickCell(0, 0);
            game.clickCell(1, 0);

            game.clickCell(0, 1);
            game.clickCell(1, 1);

            game.clickCell(1, 2);
            game.clickCell(0, 2);

            game.clickCell(2, 0);
            game.clickCell(2, 2);

            game.clickCell(2, 1);

            const state = game.getState();
            expect(state).toEqual({
                complete: true,
                winner: null,
                whoseTurn: null,
                winPath: []
            });
        })
});

export {
    createDocMock,
    createDomMock,
    createClassListMock
};
