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
const checkEventBasedAutomation = (topic, value) => {
  const automations = getAutomations();

  if (automations) {
    automations.map(automation => {
      if (topic === automation.if.topic) {
        if (automation.if.morethan) {
          if (value > automation.if.morethan) {
            triggerAutomation(automation, topic, value);
          }
        } else if (automation.if.lessthan) {
          if (value < automation.if.lessthan) {
            triggerAutomation(automation, topic, value);
          }
        } else if (automation.if.equals) {
          if (value == automation.if.equals) {
            triggerAutomation(automation, topic, value);
          }
        }
      }
    });
  }
};

/**
 * Trigger automation
 */
const triggerAutomation = (automation, topic, value) => {
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
  const value = automation.then.value.toString();
  const topic = automation.then.event.toString();

  console.log("trigger device automation", automation);

  // Set device in firebase
  deviceRef.child(topic).update({
    value: value
  });

  // Log action
  writeLog(
    "Device automation triggered: " + topic + " changed with payload: " + value
  );
};

module.exports = {
  checkTimeBasedAutomation,
  checkEventBasedAutomation,
  triggerAutomation
};
