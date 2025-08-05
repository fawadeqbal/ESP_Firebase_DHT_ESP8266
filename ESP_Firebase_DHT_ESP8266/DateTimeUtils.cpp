#include "DateTimeUtils.h"

// Static member initialization
WiFiUDP DateTimeUtils::ntpUDP;
NTPClient* DateTimeUtils::timeClient = nullptr;

void DateTimeUtils::begin() {
    // Initialize NTP client for Pakistan Time (UTC+5)
    timeClient = new NTPClient(ntpUDP, "pool.ntp.org", 5 * 3600, 60000);
    timeClient->begin();
    timeClient->update();
}
unsigned long DateTimeUtils::getCurrentTimestamp() {
    timeClient->update();
    return timeClient->getEpochTime() * 1000UL; // milliseconds
}

String DateTimeUtils::getCurrentDateTime() {
    timeClient->update();
    time_t epochTime = timeClient->getEpochTime();
    struct tm *ptm = gmtime((time_t *)&epochTime);
    
    char buffer[32];
    sprintf(buffer, "%02d-%02d-%d %02d:%02d:%02d",
            ptm->tm_mday, ptm->tm_mon + 1, ptm->tm_year + 1900,
            ptm->tm_hour, ptm->tm_min, ptm->tm_sec);
    
    return String(buffer);
} 