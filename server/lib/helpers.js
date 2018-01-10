"use strict";

/**
 * Import packages
 */
const fs = require("fs");
const exec = require("child_process").exec;

// TODO: log to dir (something with chmod?)
const writeLog = message => {
  if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs");
  }
  fs.appendFile("actions.log", message.toString() + "\n", () => {});
};

/**
 * Firebase snapshot to array with objects
 */
const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
};

/**
 * Run python script with argument
 */
const executePythonScript = (scriptName, argument) => {
  const scriptLocation = `./scripts/${scriptName}.py`;
  exec(`${scriptLocation} ${argument}`, (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
};

module.exports = {
  writeLog,
  snapshotToArray,
  executePythonScript
};
