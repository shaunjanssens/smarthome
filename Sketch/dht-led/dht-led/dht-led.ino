#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <FirebaseArduino.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include "DHT.h"

#define DHTTYPE DHT11
#define FIREBASE_HOST "smarthome-9d4f6.firebaseio.com"
#define FIREBASE_AUTH "GxpsqcyIH9JNkzrdImy1jstKwFfIj76YaD61r2IO"

#define LEDPIN D0
#define DHTPIN D1

// MQTT Config
const char* mqttServer = "m23.cloudmqtt.com";
const int mqttPort = 19235;
const char* mqttUser = "xuepegwq";
const char* mqttPassword = "hfAFTh1heVSy";
const char* subscribeTopic = "thermostat";
const char* publishTopic = "hub";

DHT dht(DHTPIN, DHTTYPE);

static char celsiusTemp[7];
static char humidityTemp[7];

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Initializing serial port for debugging purposes
  Serial.begin(115200);
  delay(10);

  WiFiManager wifiManager;
  wifiManager.autoConnect("smarthome-thermostat");

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  
  dht.begin();
  Serial.println("Humidity and temperature\n\n");
  delay(700);

  pinMode(LEDPIN, OUTPUT);
  digitalWrite(LEDPIN, LOW);

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.set("sensors/temperature/platform", "temperature");
  Firebase.set("sensors/humidity/platform", "humidity");
  Firebase.set("sensors/temperature/topic", "temperature");
  Firebase.set("sensors/humidity/topic", "humidity");
  Firebase.set("sensors/temperature/value", 0);
  Firebase.set("sensors/humidity/value", 0);
}

void loop() {
  // put your main code here, to run repeatedly:
 if (!client.connected()) {
    reconnect();
  }

  float h = dht.readHumidity();
  float t = dht.readTemperature();    

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");     
  } else {
    Firebase.setFloat("sensors/temperature/value", t);
    Firebase.setFloat("sensors/humidity/value", h);
    delay(100);
  }
  
  client.loop();
}

/**
 * MQTT Callback
 */
void callback(char* topic, byte* payload, unsigned int length) {
  if (strcmp(topic,subscribeTopic)==0) {
    if (((char)payload[0]) == '1') {
      digitalWrite(LEDPIN, HIGH);
    } else {
      digitalWrite(LEDPIN, LOW);
    }
  }
}

/**
 * Reconnect to MQTT
 */
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "smarthome-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), mqttUser, mqttPassword)) {
      Serial.println("connected");
      client.subscribe(subscribeTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
