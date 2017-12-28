// Require packages
const express = require("express");
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
    const value = snapshot.val()["lastvalue"];
    const name = snapshot.val()["name"];
    const topic = snapshot.val()["topic"];

    writeLog(
      "Topic changed: " + name.toString() + " with payload: " + value.toString()
    );

    client.publish(topic.toString(), value.toString());
  });

  sensors.on("child_changed", snapshot => {
    const value = snapshot.val()["lastvalue"];
    const topic = snapshot.key;

    writeLog(
      "Topic changed: " +
        topic.toString() +
        " with payload: " +
        value.toString()
    );

    client.publish(topic.toString(), value.toString());
  });
}

/**
 * Helper functions
 */

// Write line to log
const writeLog = message => {
  fs.appendFile("messages.txt", message.toString() + "\n", () => {
    console.log("Log succesful");
  });
};

// Register topics
registerFirebaseTopics();

// Start listening
firebaseListener();
