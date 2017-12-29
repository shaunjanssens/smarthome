// Require packages
const express = require("express");
const https = require("https");
const querystring = require("querystring");
const firebase = require("firebase-admin");
const fetch = require("node-fetch");
const mqtt = require("mqtt");
const fs = require("fs");

// Require config file
const config = require("./config");

// Initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(config.firebase),
  databaseURL: config.firebase.database_url
});

// Initialize MQTT client
const client = mqtt.connect(config.mqtt.host, {
  username: config.mqtt.username,
  password: config.mqtt.password,
  port: config.mqtt.port
});

// Say hello on succesful connect
client.on("connect", () => {
  client.subscribe("hub");
  client.publish("hub", "Hub online at " + Date.now());
});

// Log every message
client.on("message", (topic, message) => {
  writeLog("Message recieved with payload: " + message);
});

// Save automations and changes
const automationsRef = firebase.database().ref("/automations");
let automations = null;
automationsRef.on("value", snapshot => {
  automations = snapshotToArray(snapshot);
});

// Register all topics in firebase
function snapshotToArray(snapshot) {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
}

function registerFirebaseTopics() {
  let topicsRef = firebase.database().ref("/topics");
  topicsRef.once("value", topicsSnapshot => {
    let topics = snapshotToArray(topicsSnapshot);

    config.devices.map(device => {
      const foundTopic = topics.find(topic => {
        return topic.topic === device.topic;
      });

      if (!foundTopic) {
        firebase
          .database()
          .ref("topics/" + device.topic)
          .set({
            topic: device.topic,
            name: device.name,
            platform: device.platform,
            lastvalue: 0
          });

        writeLog("Topic created: " + device.name + "(" + device.topic + ")");
      }
    });
  });
}

// Listen to changes in Firebase
function firebaseListener() {
  let topics = firebase.database().ref("/topics");
  let sensors = firebase.database().ref("/sensors");

  topics.on("child_changed", snapshot => {
    const value = snapshot.val()["lastvalue"].toString();
    const name = snapshot.val()["name"].toString();
    const topic = snapshot.val()["topic"].toString();

    writeLog("Topic changed: " + name + " with payload: " + value);

    client.publish(topic, value);
  });

  sensors.on("child_changed", snapshot => {
    const value = snapshot.val()["lastvalue"].toString();
    const topic = snapshot.key.toString();

    writeLog("Topic changed: " + topic + " with payload: " + value);

    checkAutomation(topic, value);

    client.publish(topic, value);
  });
}

// Automation
function checkTimeBasedAutomation() {
  automations.map(automation => {
    const date = new Date();
    const currentTime = date.getHours() + ":" + date.getMinutes();

    if (automation.if.topic === "time") {
      if (currentTime.toString() === automation.if.equals.toString()) {
        triggerIftttAction(automation, "time", currentTime);
      }
    }
  });
}

function checkAutomation(topic, value) {
  automations.map(automation => {
    if (topic === automation.if.topic) {
      if (automation.if.morethan) {
        if (value > automation.if.morethan) {
          triggerIftttAction(automation, topic, value);
        }
      } else if (automation.if.lessthan) {
        if (value < automation.if.lessthan) {
          triggerIftttAction(automation, topic, value);
        }
      } else if (automation.if.equal) {
        if (value === automation.if.equals) {
          triggerIftttAction(automation, topic, value);
        }
      }
    }
  });
}

function triggerIftttAction(automation, topic, value) {
  let date = new Date();
  if (
    date.setHours(date.getHours() - 1) >= automation.lastfired ||
    !automation.lastfired
  ) {
    console.log("Automation is fired more than 1 hour ago thus lets go!");
    // Update last triggered
    automationsRef.child(automation.key).update({ lastfired: Date.now() });

    let postData = querystring.stringify({
      value1: value
    });

    let options = {
      hostname: "maker.ifttt.com",
      path: `/trigger/${automation.then.event}/with/key/${config.ifttt.apikey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };

    const req = https.request(options, res => {
      res.setEncoding("utf8");
      res.on("data", chunk => {
        console.log(`BODY: ${chunk}`);
      });
      res.on("end", () => {
        console.log("No more data in response.");
      });
    });

    req.on("error", e => {
      console.error(`problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
  } else {
    console.log("Automation is fired less than 1 hour ago");
  }
}

/**
 * Helper functions
 */

// Write line to log
const writeLog = message => {
  fs.appendFile("messages.txt", message.toString() + "\n", () => {});
};

Date.prototype.subtractHours = function(h) {
  this.setHours(this.getHours() - h);
  return this;
};

// Register topics
registerFirebaseTopics();

// Start listening
firebaseListener();

// Start timer for time-based actions
setInterval(function() {
  checkTimeBasedAutomation();
}, 5000);
