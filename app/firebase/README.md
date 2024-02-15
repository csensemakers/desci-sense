# Run functions locally

Build `functions`

```
cd functions
yarn
yarn build:watch
cd ..
```

Emulate them from. This folder

```
yarn
yarn emulate
```

# Test functions locally

To test the functions locally you need to run a Firestore emulator.

```
yarn
yarn emulate-test
```

Then run the `functions-debug` script from vscode debug window.

You can add breakpoints in the TS file and they should work.
