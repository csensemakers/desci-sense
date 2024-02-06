# SenseMaker App

To run the app locally

## Express Server

Run the express server in a local firestore emulator

```
cd firebase
// install yarn here to use emulation and deploy scripts
yarn install

// the first time you need to do two things
// 1) go into the functions folder and install the dependencies
cd functions
yarn install 
cd ..

// 2) create the env.ts file by copying the env.sample.ts file and filling its values (ask maintainer)
cp src/config/env.sample.ts src/config/env.ts

// run the emulation script from the firebase folder
yarn emulate

// if you want to make changes to the server and load them in the emulator automatically build:watch the functions folder
cd functions
yarn build:watch

```

## Python Server

Run the python processing functions in another local firestore emulator

```
cd firebase-py/functions  

// the first time you need to install env so run these two commands from the functions folder
python3.11 -m venv venv
source venv/bin/activate && python3 -m pip install -r requirements.txt

// run the emulation script from the firebase-py/functions folder
firebase emulators:start
```

## Frontend React App

Run the frontend app

```
cd webapp
yarn install
yarn start
```
