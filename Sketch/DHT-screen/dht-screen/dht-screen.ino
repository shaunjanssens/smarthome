#include "DHT.h"
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h> 

#define DHTTYPE DHT11
#define FIREBASE_HOST "smarthome-9d4f6.firebaseio.com"
#define FIREBASE_AUTH "GxpsqcyIH9JNkzrdImy1jstKwFfIj76YaD61r2IO"
#define WIFI_SSID "schoun-2.4Ghz"
#define WIFI_PASSWORD "Azerty123"

DHT dht(D2, DHTTYPE);
LiquidCrystal_I2C lcd(0x3F,16,2);

static char celsiusTemp[7];
static char fahrenheitTemp[7];
static char humidityTemp[7];

void setup() {
  // Initializing serial port for debugging purposes
  Serial.begin(115200);
  delay(10);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  dht.begin();
  Serial.println("Humidity and temperature\n\n");
  delay(700);
  lcd.begin(0,2);
  lcd.backlight();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.set("sensors/temperature/platform", "temperature");
  Firebase.set("sensors/humidity/platform", "humidity");
  Firebase.set("sensors/temperature/lastvalue", 0);
  Firebase.set("sensors/humidity/lastvalue", 0);
}


// runs over and over again
void loop() {
  lcd.home();
  float h = dht.readHumidity();
  float t = dht.readTemperature();    

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");     
  } else {
    lcd.print("Temp: "); 
    lcd.print(t);
    lcd.print("C");
    lcd.setCursor(0, 1);
    lcd.print("Humi: ");
    lcd.print(h);
    lcd.print("%");
    Firebase.setFloat("sensors/temperature/lastvalue", t);
    Firebase.setFloat("sensors/humidity/lastvalue", h);
  }
  
  delay(1000);
}   
