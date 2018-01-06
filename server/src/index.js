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
const { handleDevice, handleSensor } = require("./devicesandsensors.js");
const { checkTimeBasedAutomation } = require("./automations.js");
const { turnThermostatOnOff } = require("./thermostat.js");
const { startupFunction } = require("./startup.js");
const { writeLog, snapshotToArray } = require("./helpers.js");

/**
 * Watch for device changes in Firebase
 */
deviceRef.on("child_changed", snapshot => {
  const device = {
    name: snapshot.val()["name"].toString(),
    value: snapshot.val()["value"].toString(),
    topic: snapshot.val()["topic"].toString()
  };

  handleDevice(device);
});

/**
 * Watch for sensor changes in Firebase
 */
sensorRef.on("child_changed", snapshot => {
  const sensor = {
    value: snapshot.val()["value"].toString(),
    topic: snapshot.val()["topic"].toString()
  };

  handleSensor(sensor);
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
