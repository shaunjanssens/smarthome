"use strict";

/**
 * Import global variables
 */
let { client, thermostat, setThermostat } = require("./globals.js");

/**
 * Import functions
 */
const { turnThermostatOnOff } = require("./thermostat");
const { checkEventBasedAutomation } = require("./automations");
const { writeLog } = require("./helpers");

/**
 * Handle device change
 */
const handleDevice = device => {
  const { name, value, topic } = device;

  // Public message to MQTT
  client.publish(topic, value);

  // If device is thermostat
  if (topic === "thermostat") {
    setThermostat(value, null);
  }

  // Log action
  writeLog("Device: " + name + " changed with payload: " + value);
};

/**
 * Handle sensor change
 */
const handleSensor = sensor => {
  const { value, topic } = sensor;

  // If sensor is thermostat
  if (topic === "thermostat") {
    setThermostat(null, value);
  }

  // If sensor is temperature check if thermostat has to be changed
  if (topic === "temperature") {
    turnThermostatOnOff(value);
  }

  // Publish message to MQTT
  client.publish(topic, value);

  // Check automation
  checkEventBasedAutomation(topic, value);

  // Log action
  writeLog("Sensor: " + topic + " changed with payload: " + value);
};

module.exports = {
  handleDevice,
  handleSensor
};
