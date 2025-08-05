#ifndef DATETIMEUTILS_H
#define DATETIMEUTILS_H

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

class DateTimeUtils {
private:
    static WiFiUDP ntpUDP;
    static NTPClient* timeClient;
    
public:
    // Initialize NTP client
    static void begin();
    
    // Get current timestamp in milliseconds
    static unsigned long getCurrentTimestamp();
    
    // Get current date and time string
    static String getCurrentDateTime();
};

#endif 