#ifndef FIREBASE_UTILS_H
#define FIREBASE_UTILS_H

#include <Firebase_ESP_Client.h>

extern FirebaseData fbdo;
extern FirebaseAuth auth;
extern FirebaseConfig config;

extern String API_KEY;
extern String USER_EMAIL;
extern String USER_PASSWORD;
extern String DATABASE_URL;

extern void tokenStatusCallback(TokenInfo info);

void firebaseConfig();
void sendData(const String& path, bool status);
void sendData(const String& path, int value);
void sendData(const String& path, float value);
void sendData(const String& path, unsigned long value);
void sendData(const String& path, const String& value);
void sendData(const String& path, double value);

#endif // FIREBASE_UTILS_H 