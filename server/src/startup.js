"use strict";

/**
 * Import global variables
 */
let {
  config,
  deviceRef,
  sensorRef,
  automationRef,
  automations,
  setAutomations,
  getAutomations
} = require("./globals.js");

/**
 * Import functions
 */
const { snapshotToArray, writeLog } = require("./helpers");
const { handleDevice, handleSensor } = require("./devicesandsensors");

/**
 * Register new sensors and devices in firebase
 */
const registerFirebaseTopics = () => {
  deviceRef.once("value", topicSnapshot => {
    let topics = snapshotToArray(topicSnapshot);

    config.devices.map(device => {
      const foundTopic = topics.find(topic => {
        return topic.topic === device.topic;
      });

      if (!foundTopic) {
        deviceRef.child(device.topic).set({
          topic: device.topic,
          name: device.name,
          platform: device.platform,
          value: 0
        });

        writeLog(
          "New device: " + device.name + " created with topic: " + device.topic
        );
      }
    });
  });
};

/**
 * Set all devices on startup
 */
const initAllDevicesOnStartup = () => {
  deviceRef.once("value", snapshot => {
    snapshotToArray(snapshot).map(device => {
      handleDevice({
        name: device.name.toString(),
        value: device.value.toString(),
        topic: device.topic.toString()
      });
    });
  });

  sensorRef.once("value", snapshot => {
    snapshotToArray(snapshot).map(sensor => {
      handleSensor({
        value: sensor.value.toString(),
        topic: sensor.topic.toString()
      });
    });
  });
};

/**
 * Download and save all automations
 */
automationRef.once("value", snapshot => {
  setAutomations(snapshotToArray(snapshot));
});

const startupFunction = () => {
  registerFirebaseTopics();
  initAllDevicesOnStartup();
};

module.exports = {
  startupFunction
};
