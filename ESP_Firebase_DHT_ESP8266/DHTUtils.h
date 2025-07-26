#ifndef DHTUTILS_H
#define DHTUTILS_H

#include <DHT.h>

class DHTSensor {
  private:
    uint8_t pin;
    uint8_t type;
    DHT dht;
  public:
    DHTSensor(uint8_t pin, uint8_t type);
    void begin();
    float getTemperature();
    float getHumidity();
};

#endif
