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
  state: 0,
  value: 0
};

const setAutomations = automationsParameter => {
  automations = automationsParameter;
};

const getAutomations = () => {
  return automations;
};

const setThermostat = (state, value) => {
  state ? (thermostat.state = state) : null;
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
let client;
if (config.mqtt.type === "external") {
  client = mqtt.connect(config.mqtt.host, {
    username: config.mqtt.username,
    password: config.mqtt.password,
    port: config.mqtt.port ? config.mqtt.port : 1883
  });
} else if (config.mqtt.type === "local") {
  client = mqtt.connect(config.mqtt.host, {
    port: config.mqtt.port ? config.mqtt.port : 1883
  });
}

/**
 * Register Firebase references
 */
const deviceRef = firebase.database().ref("/devices");
const sensorRef = firebase.database().ref("/sensors");
const automationRef = firebase.database().ref("/automations");
const roomRef = firebase.database().ref("/rooms");

module.exports = {
  firebase: firebase,
  config: config,
  client: client,
  deviceRef: deviceRef,
  sensorRef: sensorRef,
  automationRef: automationRef,
  roomRef: roomRef,
  automations: automations,
  setAutomations: setAutomations,
  getAutomations: getAutomations,
  thermostat: thermostat,
  setThermostat: setThermostat,
  getAutomations: getAutomations
};
