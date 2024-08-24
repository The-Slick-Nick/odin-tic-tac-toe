
import { createBoardCell, createBoard, createPlayer, runGame } from "./ttt.js"

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
        }
    };
}

// mock a javascript-represented dom element
function createDomMock() {

    const classList = createClassListMock();
    const children = [];

    return {
        classList: classList,
        appendChild: (child) => children.push(child)
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
        })
});


