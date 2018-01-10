"use strict";

/**
 * Import global variables
 */
let {
  deviceRef,
  automationRef,
  setAutomations,
  getAutomations,
  client
} = require("./globals.js");

/**
 * Import functions
 */
const { triggerIftttEvent } = require("./ifttt");
const { writeLog } = require("./helpers");

/**
 * Check if current time is the same as automation timer
 */
const checkTimeBasedAutomation = () => {
  const automations = getAutomations();

  if (automations) {
    automations.map(automation => {
      const date = new Date();
      const currentTime = date.getHours() + ":" + date.getMinutes();

      if (automation.if.topic === "time") {
        if (currentTime.toString() === automation.if.equals.toString()) {
          triggerAutomation(automation, "time", currentTime);
        }
      }
    });
  }
};

/**
 * Check if value meets the automation requirements
 */
const checkEventBasedAutomation = (id, value) => {
  const automations = getAutomations();

  if (automations) {
    automations.map(automation => {
      if (id == automation.if.id) {
        if (automation.if.morethan) {
          if (value > automation.if.morethan) {
            triggerAutomation(automation, id, value);
          }
        } else if (automation.if.lessthan) {
          if (value < automation.if.lessthan) {
            triggerAutomation(automation, id, value);
          }
        } else if (automation.if.equals) {
          if (value == automation.if.equals) {
            triggerAutomation(automation, id, value);
          }
        }
      }
    });
  }
};

/**
 * Trigger automation
 */
const triggerAutomation = (automation, id, value) => {
  switch (automation.then.platform) {
    case "output":
      triggerDeviceEvent(automation, value);
      break;
    case "ifttt":
      triggerIftttEvent(automation);
      break;
  }

  // Update last triggered time
  automationRef.child(automation.key).update({ lastfired: Date.now() });
};

/**
 * Trigger device event
 */
const triggerDeviceEvent = automation => {
  const state = automation.then.state.toString();
  const topic = automation.then.event.toString();

  // Set device in firebase
  deviceRef.child(topic).update({ state: state });

  // Log action
  writeLog(
    "Device automation triggered: " + topic + " changed with payload: " + state
  );
};

module.exports = {
  checkTimeBasedAutomation,
  checkEventBasedAutomation,
  triggerAutomation
};
