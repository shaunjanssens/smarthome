"use strict";

/**
 * Import packages
 */
const { writeLog } = require("./helpers.js");

/**
 * Import global variables
 */
let { deviceRef, thermostat } = require("./globals.js");

/**
 * Check if thermostat has to be turned on or off
 */
const checkThermostat = currentTemp => {
  let returnValue = null;

  if (currentTemp < thermostat.value) {
    if (thermostat.state == "0") {
      returnValue = "1";
    }
  } else if (currentTemp >= thermostat.value) {
    if (thermostat.state == "0") {
      returnValue = "0";
    } else if (
      thermostat.state == "1" &&
      parseInt(currentTemp) - 3 >= thermostat.value
    ) {
      returnValue = "0";
    } else {
      if (thermostat.state == "0") {
        returnValue = "1";
      }
    }
  }

  return returnValue;
};

/**
 * Turn thermostat on or off
 */
const turnThermostatOnOff = value => {
  const thermostatCheck = checkThermostat(value);

  if (thermostatCheck) {
    deviceRef.child("thermostat").update({
      state: thermostatCheck.toString()
    });

    // Log action
    const thermostatStatus = thermostatCheck == "1" ? "on" : "off";
    writeLog("Thermostat is turned " + thermostatStatus);
  }
};

module.exports = {
  turnThermostatOnOff
};
