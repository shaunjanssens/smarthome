"use strict";

/**
 * Import packages
 */
const https = require("https");
const querystring = require("querystring");
const fetch = require("node-fetch");

/**
 * Import functions
 */
const { writeLog } = require("./helpers");

/**
 * Import global variables
 */
let { config, automationRef } = require("./globals.js");

/**
 * Trigger IFTTT.com maker action
 */
const triggerIftttEvent = (automation, value) => {
  let date = new Date();
  if (
    date.setHours(date.getHours() - 1) >= automation.lastfired ||
    !automation.lastfired
  ) {
    // Set postdata
    let postData = querystring.stringify({
      value1: value
    });

    // Set request options
    let options = {
      hostname: "maker.ifttt.com",
      path: `/trigger/${automation.then.event}/with/key/${config.ifttt.apikey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };

    // Create request
    const req = https.request(options, res => {
      res.setEncoding("utf8");
      res.on("data", chunk => {});
      res.on("end", () => {});
    });

    // Log error error
    req.on("error", e => {
      writeLog("!!!ERROR!!! Ifttt: " + e.message);
    });

    // Send request
    req.write(postData);
    req.end();

    // Log event
    writeLog(
      "Ifttt automation triggered: " +
        automation.then.event +
        " triggered with payload: " +
        value
    );
  }
};

module.exports = {
  triggerIftttEvent
};
