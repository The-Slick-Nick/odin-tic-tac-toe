/**
 * ttt.spec.js
 *
 * Tests on tic tac toe game module objects
 */

const createBoardCell = require("./ttt.js");


/******************************************************************************
 * Mocks
******************************************************************************/

// Mock the functionality of a dom element's classList
function getClassListMock() {

    const classes = [];

    return {
        add: (cls) => { classes.push(cls); },
        remove: (cls) => {
            let idx = classes.indexOf(cls);
            if (idx !== -1) {
                classes.splice(idx);
            }
        },
        toggle: (cls) => {

            let idx = classes.indexOf(cls);
            if (idx === -1) {
                classes.push(cls);
            }
            else {
                classes.splice(idx);
            }
        }
    };

}

// Mock the funtionality of a generic dom element
function getDomMock() {

    const children = [];

    return {
        classList: classList,
        appendChild: (child) => children.push(child)
    }
}


function getDocMock() {
    return {
        querySelector: (arg) => getDomMock(),
        createElement: (arg) => getDomMock()
    };
}


/******************************************************************************
 * Tests
******************************************************************************/

describe('create a cell', () => {
    test('create a single cell', () => {

        const mycell = createBoardCell(getDocMock());
    });
});

