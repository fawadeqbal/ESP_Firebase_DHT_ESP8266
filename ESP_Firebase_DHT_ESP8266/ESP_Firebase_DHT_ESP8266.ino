// ESP_Firebase_DHT_ESP8266.ino
// Basic structure for ESP8266 with Firebase and WiFi connection

#include <Arduino.h>
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "WiFiConnection.h"
#include "FirebaseUtils.h"
#include "DHTUtils.h"

DHTSensor dhtSensor(D4, DHT11); // Use your actual pin and sensor type
String sensorId = "sensor1"; // Change this for each sensor

String WIFI_SSID = "ASlAM 018 2.4G";
String WIFI_PASSWORD = "cuiatd@000";
String API_KEY = "AIzaSyCTwqLXb5pYqNM1FEWk4lwZ74oi3AuIz3c";
String USER_EMAIL = "fawadeqbal@gmail.com";
String USER_PASSWORD = "user123";
String DATABASE_URL = "https://enviroment-controll-default-rtdb.firebaseio.com/";

void setup() {
  Serial.begin(115200);
  wifiConnection();
  firebaseConfig();
  dhtSensor.begin();
}

void loop() {
  if (Firebase.ready()) {
    float temperature = dhtSensor.getTemperature();
    float humidity = dhtSensor.getHumidity();

    if (temperature != -1) {
      sendData(sensorId + "/temperature", temperature);
    }
    if (humidity != -1) {
      sendData(sensorId + "/humidity", humidity);
    }
    delay(600);
  }
  delay(1000);
} 