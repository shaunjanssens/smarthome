#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>

// Define output pins
#define RELAIS1 D0
#define RELAIS2 D1
#define RELAIS3 D2
#define RELAIS4 D3

// Define network
const char* ssid = "";
const char* password = "";

// Define MQTT
const char* mqttServer = "";
const int mqttPort = ;
const char* mqttUser = "";
const char* mqttPassword = "";
const char* subscribeTopic1 = "";
const char* subscribeTopic2 = "";
const char* subscribeTopic3 = "";
const char* subscribeTopic4 = "";
const char* publishTopic = "hub";

WiFiClient espClient;
PubSubClient client(espClient);

/**
 * Initial setup
 */
void setup() {
  Serial.begin(115200);
  // Comment setup_wifi() and uncommend WiFiManager for wifi setup popup
  setup_wifi();
  // WiFiManager wifiManager;
  // wifiManager.autoConnect("smarthome-outlet");
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  pinMode(RELAIS1, OUTPUT);
  pinMode(RELAIS2, OUTPUT);
  pinMode(RELAIS3, OUTPUT);
  pinMode(RELAIS4, OUTPUT);
  digitalWrite(RELAIS1, HIGH);
  digitalWrite(RELAIS2, HIGH);
  digitalWrite(RELAIS3, HIGH);
  digitalWrite(RELAIS4, HIGH);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println("Message recieved");

  if (strcmp(topic,subscribeTopic1)==0) {
    Serial.println("Topic selected");
    if (((char)payload[0]) == '1') {
      Serial.println("Relais is on");
      digitalWrite(RELAIS1, LOW);
    } else {
      Serial.println("Relais is of");
      digitalWrite(RELAIS1, HIGH);
    }
  }

  if (strcmp(topic,subscribeTopic2)==0) {
    Serial.println("Topic selected");
    if (((char)payload[0]) == '1') {
      Serial.println("Relais is on");
      digitalWrite(RELAIS2, LOW);
    } else {
      Serial.println("Relais is of");
      digitalWrite(RELAIS2, HIGH);
    }
  }

  if (strcmp(topic,subscribeTopic3)==0) {
    Serial.println("Topic selected");
    if (((char)payload[0]) == '1') {
      Serial.println("Relais is on");
      digitalWrite(RELAIS3, LOW);
    } else {
      Serial.println("Relais is of");
      digitalWrite(RELAIS3, HIGH);
    }
  }

  if (strcmp(topic,subscribeTopic4)==0) {
    Serial.println("Topic selected");
    if (((char)payload[0]) == '1') {
      Serial.println("Relais is on");
      digitalWrite(RELAIS4, LOW);
    } else {
      Serial.println("Relais is of");
      digitalWrite(RELAIS4, HIGH);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();
}

/**
 * Setup wifi connection
 */
void setup_wifi() {
  delay(100);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
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
      client.subscribe(subscribeTopic1);
      client.subscribe(subscribeTopic2);
      client.subscribe(subscribeTopic3);
      client.subscribe(subscribeTopic4);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
