"use strict";

/**
 * Import global variables
 */
let {
  deviceRef,
  sensorRef,
  automationRef,
  automations,
  setAutomations
} = require("./globals.js");

/**
 * Import functions
 */
const { handleDevice, handleSensor } = require("./handling.js");
const { checkTimeBasedAutomation } = require("./automations.js");
const { turnThermostatOnOff } = require("./thermostat.js");
const { startupFunction } = require("./startup.js");
const { writeLog, snapshotToArray } = require("./helpers.js");

/**
 * Watch for device changes in Firebase
 */
deviceRef.on("child_changed", snapshot => {
  handleDevice(snapshot.val());
});

/**
 * Watch for sensor changes in Firebase
 */
sensorRef.on("child_changed", snapshot => {
  handleSensor(snapshot.val());
});

/**
 * Watch for automations in Firebase
 */
automationRef.on("value", snapshot => {
  setAutomations(snapshotToArray(snapshot));
});

/**
 * Check time based automations every 5 seconds
 */
setInterval(() => {
  if (checkTimeBasedAutomation) {
    checkTimeBasedAutomation();
  }
}, 5000);

/**
 * Execute startup functions
 */
startupFunction();
