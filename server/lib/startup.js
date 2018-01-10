"use strict";

/**
 * Import global variables
 */
let {
  config,
  deviceRef,
  sensorRef,
  automationRef,
  roomRef,
  automations,
  setAutomations,
  getAutomations
} = require("./globals.js");

/**
 * Import functions
 */
const { snapshotToArray, writeLog } = require("./helpers");
const { handleDevice, handleSensor } = require("./handling");

/**
 * Register new sensors and devices in firebase
 */
const registerFirebaseDevices = () => {
  /**
   * Add devices
   */
  deviceRef.once("value", snapshot => {
    const firebaseDevices = snapshotToArray(snapshot);

    config.devices.map(device => {
      const deviceAlreadyInFirebase = firebaseDevices.find(firebaseDevice => {
        return firebaseDevice.key === device.id;
      });

      if (!deviceAlreadyInFirebase) {
        device.state = 0; // Set device value to 0
        deviceRef.child(device.id).set(device); // Set new device in Firebase
        writeLog("New device: " + device.name + " created");
      }
    });
  });

  /**
   * Add sensors
   */
  sensorRef.once("value", snapshot => {
    const firebaseSensors = snapshotToArray(snapshot);

    config.sensors.map(sensor => {
      const sensorAlreadyInFirebase = firebaseSensors.find(firebaseSensor => {
        return firebaseSensor.key === sensor.id;
      });

      if (!sensorAlreadyInFirebase) {
        sensorRef.child(sensor.id).set(sensor); // Set new sensor in Firebase
        writeLog("New sensor: " + sensor.id + " created");
      }
    });
  });

  /**
   * Add rooms
   */
  roomRef.remove();
  config.rooms.map(room => {
    roomRef.child(room.id).set(room);
  });
};

/**
 * Set all devices on startup
 */
const initAllDevicesOnStartup = () => {
  deviceRef.once("value", snapshot => {
    snapshotToArray(snapshot).map(device => {
      handleDevice(device);
    });
  });

  sensorRef.once("value", snapshot => {
    snapshotToArray(snapshot).map(sensor => {
      handleSensor(sensor);
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
  registerFirebaseDevices();
  initAllDevicesOnStartup();
};

module.exports = {
  startupFunction
};
