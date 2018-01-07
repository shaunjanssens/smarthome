"use strict";

/**
 * Import packages
 */
const fs = require("fs");

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

module.exports = {
  writeLog,
  snapshotToArray
};
