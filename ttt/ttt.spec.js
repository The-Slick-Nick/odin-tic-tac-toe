
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
        })
});

describe("Test Board Cell", () => {
    test("Place a token", () => {
        const doc = createDocMock();
        const testCell = createBoardCell(doc, 0, 0);

        testCell.placeToken("x");
        expect(testCell.currentToken()).toEqual("x");
    }),

        test("No token", () => {
            const doc = createDocMock();
            const testCell = createBoardCell(doc, 0, 0);
            expect(testCell.currentToken()).toEqual("");
        })
});

