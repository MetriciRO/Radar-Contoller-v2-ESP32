#pragma once

#include <Arduino.h>
#include <AsyncJson.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>
#include <HTTPClient.h>
#include <logs.h>
#include <ezButton.h>

#define RELAY1 32
#define RELAY2 33
// Reset button
#define RST_BTN 34

// Radar GPIOs
#define RX1 36
#define TX1 4
#define TRIGGER_PIN 16

#define DEBOUNCE_TIME 20

HardwareSerial USE_SERIAL1;

extern ezButton triggerPin;

extern bool changed_network_config;
extern bool restart_flag;

void restartSequence(unsigned int);

void listAllFiles();

void setPins();