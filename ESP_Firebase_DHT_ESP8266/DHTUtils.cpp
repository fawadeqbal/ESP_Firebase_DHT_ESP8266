#include "DHTUtils.h"

DHTSensor::DHTSensor(uint8_t pin, uint8_t type) : pin(pin), type(type), dht(pin, type) {}

void DHTSensor::begin() {
  dht.begin();
}

float DHTSensor::getTemperature() {
  float t = dht.readTemperature();
  return isnan(t) ? -1 : t;
}

float DHTSensor::getHumidity() {
  float h = dht.readHumidity();
  return isnan(h) ? -1 : h;
}
