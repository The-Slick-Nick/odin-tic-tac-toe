import { createGameBoard, createPlayer } from "./ttt.js"
import { basicAiStrategy, calcBestMove } from "./strategy.js"
import { createDocMock } from "./ttt.spec.js"

describe("Test basic strategy", () => {

    test("Prefers center", () => {

        const board = createGameBoard();

        let result = basicAiStrategy("x", board);
        expect(result).toEqual([1, 1]);
    });

    test("Completes row", () => {
        const board = createGameBoard();

        board.place("x", 0, 0);
        board.place("x", 0, 1);
        const result = basicAiStrategy("x", board);
        expect(result).toEqual([0, 2]);
    });

    test("Blocks opponent", () => {

        const board = createGameBoard();

        board.place("x", 0, 0);
        board.place("x", 0, 1);
        const result = basicAiStrategy("o", board);
        expect(result).toEqual([0, 2]);
    });

    test("Prefers completing to blocking", () => {
        const board = createGameBoard();

        board.place("o", 0, 0);
        board.place("o", 0, 1);
        board.place("x", 2, 0);
        board.place("x", 2, 1);
        const result = basicAiStrategy("x", board);
        expect(result).toEqual([2, 2]);
    });
});


describe("Test optimal strategy", () => {

    test("Fills row", () => {

        const board = createGameBoard();
        let boardArr = [
            "x", "x", "",
            "", "", "",
            "", "", ""
        ];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                board.place(boardArr[c + 3 * r], r, c);
            }
        }

        let result = calcBestMove("x", "o", board);
        expect(result).toContainEqual([0, 2]);

    }),

        test("Fills column", () => {

            const board = createGameBoard();
            let boardArr = [
                "x", "", "",
                "x", "", "",
                "", "", ""
            ];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board.place(boardArr[c + 3 * r], r, c);
                }
            }

            let result = calcBestMove("x", "o", board);
            expect(result).toContainEqual([2, 0]);
        }),

        test("Fills se diagonal", () => {

            const board = createGameBoard();
            let boardArr = [
                "x", "", "",
                "", "x", "",
                "", "", ""
            ];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board.place(boardArr[c + 3 * r], r, c);
                }
            }

            let result = calcBestMove("x", "o", board);
            expect(result).toContainEqual([2, 2]);
        }),

        test("Fills sw diagonal", () => {

            const board = createGameBoard();
            let boardArr = [
                "", "", "x",
                "", "x", "",
                "", "", ""
            ];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board.place(boardArr[c + 3 * r], r, c);
                }
            }

            let result = calcBestMove("x", "o", board);
            expect(result).toContainEqual([2, 0]);
        }),

        test("Blocks row", () => {

            const board = createGameBoard();
            let boardArr = [
                "", "o", "o",
                "", "", "",
                "", "", ""
            ];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board.place(boardArr[c + 3 * r], r, c);
                }
            }

            let result = calcBestMove("x", "o", board);
            expect(result).toContainEqual([0, 0]);

        });

    test("Prefers filling", () => {

        const board = createGameBoard();
        let boardArr = [
            "", "o", "o",
            "x", "x", "",
            "", "", ""
        ];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                board.place(boardArr[c + 3 * r], r, c);
            }
        }

        let result = calcBestMove("x", "o", board);
        expect(result).toContainEqual([1, 2]);

    });

    test("Plans ahead", () => {

        const board = createGameBoard();

        // placing at [1, 1] or [2, 0] will not result in
        // immediate victory, but will guarantee it later
        let boardArr = [
            "x", "o", "x",
            "", "", "o",
            "", "", ""
        ];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                board.place(boardArr[c + 3 * r], r, c);
            }
        }

        let result = calcBestMove("x", "o", board);
        expect(result).toContainEqual([1, 1]);
        expect(result).toContainEqual([2, 0]);
    });

    test("One option", () => {

        const board = createGameBoard();
        let boardArr = [
            "x", "o", "x",
            "o", "o", "x",
            "", "x", "o"
        ];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                board.place(boardArr[c + 3 * r], r, c);
            }
        }

        let result = calcBestMove("x", "o", board);
        expect(result).toEqual([[2, 0]]);
    });

});
