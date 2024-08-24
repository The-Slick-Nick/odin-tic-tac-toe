# Tic-Tac-Toe
A small set of factory functions and whatnot that makes
a tic tac toe game on an appropriately set up browser.

## Tests
Getting this module testable was surprisingly difficult due to needing to
make the module importable using ESM, but that functionality being difficult
(apparently) in node.

Here's what I did (from [this stackoverflow solution](https://stackoverflow.com/questions/68956636/how-to-use-esm-tests-with-jest)),
assuming node and jest are already installsed.

1. Add/include line `"type": "module"` to file `package.json`
2. Add flag to node invocation in scripts portion of `package.json` enabling
   node to use experimental modules
3. Create a `jest.config.js` file with content `export default { transform: {} }`

package.json
```bash
{
    "type": "module",
    "scripts": {
        "test": "node --experimental-vm-modules ./node_modules/.bin/jest"
    }
}
```

jest.config.js
```bash
export default { transform: {} }
```

After this point, tests should be runnable with
```bash
npm test
```
