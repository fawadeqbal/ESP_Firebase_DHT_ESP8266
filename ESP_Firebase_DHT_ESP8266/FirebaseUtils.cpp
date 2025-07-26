#include "FirebaseUtils.h"
#include <Arduino.h>

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

extern String API_KEY;
extern String USER_EMAIL;
extern String USER_PASSWORD;
extern String DATABASE_URL;

void firebaseConfig() {
    config.api_key = API_KEY;
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;
    config.database_url = DATABASE_URL;
    config.token_status_callback = tokenStatusCallback;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
}

void sendData(const String& path, bool status) {
    FirebaseJson json;
    json.add("status", status);
    if (Firebase.RTDB.updateNode(&fbdo, path, &json)) {
        Serial.println("PASSED");
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
    } else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
    }
}

void sendData(const String& path, int value) {
    if (Firebase.RTDB.setInt(&fbdo, path, value)) {
        Serial.println("PASSED");
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
    } else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
    }
}

void sendData(const String& path, float value) {
    if (Firebase.RTDB.setFloat(&fbdo, path, value)) {
        Serial.println("PASSED");
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
    } else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
    }
}

void sendData(const String& path, const String& value) {
    if (Firebase.RTDB.setString(&fbdo, path, value)) {
        Serial.println("PASSED");
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
    } else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
    }
} 