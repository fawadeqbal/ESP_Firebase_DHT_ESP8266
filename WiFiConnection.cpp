#include "WiFiConnection.h"
#include <ESP8266WiFi.h>

extern String WIFI_SSID;
extern String WIFI_PASSWORD;

void wifiConnection() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();
} 