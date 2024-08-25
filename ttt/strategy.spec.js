import { createGameBoard, createPlayer } from "./ttt.js"
import { basicAiStrategy } from "./strategy.js"
import { createDocMock } from "./ttt.spec.js"

describe("Test basic strategy", () => {

    test("Prefers center", () => {

        const board = createGameBoard();

        let result = basicAiStrategy("x", board);
        console.log(result);
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
