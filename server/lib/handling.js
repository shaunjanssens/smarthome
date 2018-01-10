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
  if (device.platform === "mqtt") {
    // Public message to MQTT
    client.publish(device.config.topic.toString(), device.state.toString());
  } else if (device.platform === "rf433") {
    console.log("to be implemented");
  }

  // If device is thermostat
  if (device.id === "thermostat") {
    setThermostat(device.state, null);
  }

  // Log action
  writeLog("Device: " + device.name + " changed with payload: " + device.state);
};

/**
 * Handle sensor change
 */
const handleSensor = sensor => {
  // Set thermostat
  if (sensor.type === "thermostat") {
    setThermostat(null, sensor.value);
  }

  // Check if thermostat has to change if temperature is changed
  if (sensor.type === "temperature") {
    turnThermostatOnOff(sensor.value);
  }

  // Publish message to MQTT
  client.publish("sensor/ " + sensor.id.toString(), sensor.value.toString());

  // Check automation
  checkEventBasedAutomation(sensor.id, sensor.value.toString());

  // Log action
  writeLog("Sensor: " + sensor.id + " changed with payload: " + sensor.value);
};

module.exports = {
  handleDevice,
  handleSensor
};
