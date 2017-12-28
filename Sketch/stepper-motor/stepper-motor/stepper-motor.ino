#include <AccelStepper.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Define stepper motor
#define HALFSTEP 8
#define motorPin1 D0
#define motorPin2 D1
#define motorPin3 D2
#define motorPin4 D3

// Define buttons
#define buttonMin D5
#define buttonMax D6

// Define network
const char* ssid = "schoun-2.4Ghz";
const char* password = "Azerty123";

// Define MQTT
const char* mqttServer = "m23.cloudmqtt.com";
const int mqttPort = 19235;
const char* mqttUser = "xuepegwq";
const char* mqttPassword = "hfAFTh1heVSy";
const char* subscribeTopic1 = "blinds-blinds1";
const char* publishTopic = "hub";

// Initialize with pin sequence IN1-IN3-IN2-IN4 for using the AccelStepper with 28BYJ-48
AccelStepper stepper1(HALFSTEP, motorPin1, motorPin3, motorPin2, motorPin4);

// Initialize network and mqtt
WiFiClient espClient;
PubSubClient client(espClient);

// Initialize button variables
int buttonMinState = 0;
int buttonMaxState = 0;

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
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

/**
 * Initial setup
 */
void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  pinMode(buttonMin, INPUT);
  pinMode(buttonMax, INPUT);
  stepper1.setMaxSpeed(1000);
  stepper1.setAcceleration(200);
}

void callback(char* topic, byte* payload, unsigned int length) {
  if (strcmp(topic,subscribeTopic1)==0) {
    if (((char)payload[0]) == '1') {
      up();
    } else {
      down();
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();

  buttonMinState = digitalRead(buttonMin);
  buttonMaxState = digitalRead(buttonMax);

  if (buttonMinState == HIGH) {
    stepper1.stop();
    littleDown();
    stepper1.run();
  } else if (buttonMaxState == HIGH) {
    stepper1.stop();
    littleUp();
    stepper1.run();
  } else {
    stepper1.run();
  }
}

void up() {
  stepper1.moveTo(10000);
}

void down() {
  stepper1.moveTo(0);
}

void littleUp() {
  stepper1.move(100);
}

void littleDown() {
  stepper1.move(-100);
}

