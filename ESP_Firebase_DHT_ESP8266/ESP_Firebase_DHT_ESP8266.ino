// ESP_Firebase_DHT_ESP8266.ino
// Professional IoT sensor data tracking with Firebase

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
#include "DateTimeUtils.h"

DHTSensor dhtSensor(D4, DHT11);
String sensorId = "sensor1";

// Configuration
String WIFI_SSID = "ASlAM 018 2.4G";
String WIFI_PASSWORD = "cuiatd@000";
String API_KEY = "AIzaSyCTwqLXb5pYqNM1FEWk4lwZ74oi3AuIz3c";
String USER_EMAIL = "fawadeqbal@gmail.com";
String USER_PASSWORD = "user123";
String DATABASE_URL = "https://enviroment-controll-default-rtdb.firebaseio.com/";

// Data tracking variables
unsigned long lastReadingTime = 0;
const unsigned long READING_INTERVAL = 30000; // 30 seconds for professional monitoring

// Statistical tracking
float minTemp = 999, maxTemp = -999, avgTemp = 0;
float minHum = 999, maxHum = -999, avgHum = 0;
int readingCount = 0;
unsigned long totalReadings = 0;

// All time logic moved to DateTimeUtils.h/cpp for better maintainability

void setup() {
  Serial.begin(115200);
  Serial.println("\n🚀 ESP8266 Firebase DHT Sensor Starting...");
  
  wifiConnection();
  firebaseConfig();
  dhtSensor.begin();
  
  // Initialize NTP time sync
  DateTimeUtils::begin();
  
  Serial.println("🎉 IoT Sensor System Started!");
  Serial.println("Current time: " + DateTimeUtils::getCurrentDateTime());
}

void loop() {
  unsigned long currentTime = millis();
  
  if (Firebase.ready() && (currentTime - lastReadingTime >= READING_INTERVAL)) {
    float temperature = dhtSensor.getTemperature();
    float humidity = dhtSensor.getHumidity();
    
    if (temperature != -1 && humidity != -1) {
      // Get current timestamp
      unsigned long timestamp = DateTimeUtils::getCurrentTimestamp();
      Serial.printf("DEBUG: Will store timestamp: %lu, Date: %s\n", timestamp, DateTimeUtils::getCurrentDateTime().c_str());
      
      // Update statistics
      updateStatistics(temperature, humidity);
      
      // Send data to Firebase
      sendCurrentReadings(temperature, humidity, timestamp);
      sendHistoricalData(temperature, humidity, timestamp);
      
      // Send statistics periodically (every 10 readings)
      if (readingCount % 10 == 0) {
        sendStatistics();
      }
      
      lastReadingTime = millis(); // or lastReadingTime = timestamp; (but not a String)
      totalReadings++;
      
      // Display reading
      Serial.printf("Reading #%lu: Temp=%.1f°C, Hum=%.1f%% at %s\n", 
                   totalReadings, temperature, humidity, DateTimeUtils::getCurrentDateTime().c_str());
    }
  }
  delay(1000);
}

void updateStatistics(float temp, float hum) {
  // Update min/max values
  if (temp < minTemp) minTemp = temp;
  if (temp > maxTemp) maxTemp = temp;
  if (hum < minHum) minHum = hum;
  if (hum > maxHum) maxHum = hum;
  
  // Update running average
  avgTemp = (avgTemp * readingCount + temp) / (readingCount + 1);
  avgHum = (avgHum * readingCount + hum) / (readingCount + 1);
  readingCount++;
}

void sendCurrentReadings(float temp, float hum, unsigned long timestamp) {
  // Send current/latest readings with proper data types
  sendData(sensorId + "/current/temperature", temp);
  sendData(sensorId + "/current/humidity", hum);
  sendData(sensorId + "/current/timestamp", static_cast<double>(timestamp));  // Number, not string
  sendData(sensorId + "/current/reading_number", (int)totalReadings);
}

void sendHistoricalData(float temp, float hum, unsigned long timestamp) {
  // Store in historical data with timestamp as key
  Serial.printf("DEBUG: History timestamp: %lu, Date: %s\n", timestamp, DateTimeUtils::getCurrentDateTime().c_str());
  String timeKey = String(timestamp);
  sendData(sensorId + "/history/" + timeKey + "/temperature", temp);
  sendData(sensorId + "/history/" + timeKey + "/humidity", hum);
  sendData(sensorId + "/history/" + timeKey + "/timestamp", static_cast<double>(timestamp));  // Number, not string
  sendData(sensorId + "/history/" + timeKey + "/reading_number", (int)totalReadings);
}

void sendStatistics() {
  unsigned long currentTimestamp = DateTimeUtils::getCurrentTimestamp();
  Serial.printf("DEBUG: Statistics last_update: %lu, Date: %s\n", currentTimestamp, DateTimeUtils::getCurrentDateTime().c_str());
  
  // Send statistics with correct data types
  sendData(sensorId + "/statistics/min_temperature", minTemp);
  sendData(sensorId + "/statistics/max_temperature", maxTemp);
  sendData(sensorId + "/statistics/avg_temperature", avgTemp);
  sendData(sensorId + "/statistics/min_humidity", minHum);
  sendData(sensorId + "/statistics/max_humidity", maxHum);
  sendData(sensorId + "/statistics/avg_humidity", avgHum);
  sendData(sensorId + "/statistics/total_readings", (int)totalReadings);
  sendData(sensorId + "/statistics/last_update", static_cast<double>(currentTimestamp));
  
  Serial.printf("Statistics updated at %s\n", DateTimeUtils::getCurrentDateTime().c_str());
} 