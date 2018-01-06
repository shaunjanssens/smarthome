"use strict";

/**
 * Import packages
 */
const firebase = require("firebase-admin");
const mqtt = require("mqtt");

/**
 * Load config file
 */
const config = require("../config/config.json");

/**
 * Register global variables
 */
let automations = null;
let thermostat = {
  status: 0,
  value: 0
};

const setAutomations = automationsParameter => {
  automations = automationsParameter;
};

const getAutomations = () => {
  return automations;
};

const setThermostat = (status, value) => {
  status ? (thermostat.status = status) : null;
  value ? (thermostat.value = value) : null;
};

const getThermostat = () => {
  return thermostat;
};

/**
 * Initialize Firebase instance
 */
firebase.initializeApp({
  credential: firebase.credential.cert(config.firebase),
  databaseURL: config.firebase.database_url
});

/**
 * Initialize MQTT client
 */
const client = mqtt.connect(config.mqtt.host, {
  username: config.mqtt.username ? config.mqtt.username : null,
  password: config.mqtt.password ? config.mqtt.password : null,
  port: config.mqtt.port ? config.mqtt.port : null
});

/**
 * Register Firebase references
 */
const deviceRef = firebase.database().ref("/devices");
const sensorRef = firebase.database().ref("/sensors");
const automationRef = firebase.database().ref("/automations");

module.exports = {
  firebase: firebase,
  config: config,
  client: client,
  deviceRef: deviceRef,
  sensorRef: sensorRef,
  automationRef: automationRef,
  automations: automations,
  setAutomations: setAutomations,
  getAutomations: getAutomations,
  thermostat: thermostat,
  setThermostat: setThermostat,
  getAutomations: getAutomations
};
