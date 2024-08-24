import { createGameBoard, createPlayer } from "./ttt.js"
import { basicAiStrategy } from "./strategy.js"
import { createDocMock } from "./ttt.spec.js"

describe("Test basic strategy", () => {

    test("Prefers center", () => {

        const board = createGameBoard();

        let result = basicAiStrategy("x", board);
        console.log(result);
        expect(result).toEqual({ row: 1, col: 1 });
    });

    test("Completes row", () => {
        const board = createGameBoard();

        board.place("x", 0, 0);
        board.place("x", 0, 1);
        const result = basicAiStrategy("x", board);
        expect(result).toEqual({ row: 0, col: 2 });
    });


});
