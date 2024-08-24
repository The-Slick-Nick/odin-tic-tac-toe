import { createGameBoard, createPlayer } from "./ttt.js"
import { basicAiStrategy } from "./strategy.js"
import { createDocMock } from "./ttt.spec.js"

describe("Test strategy", () => {

    test("Prefers center", () => {

        const board = createGameBoard(createDocMock());

        let result = basicAiStrategy(board);
        console.log(result);
        expect(result).toEqual({ row: 0, col: 0 });



    });

});
