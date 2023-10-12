#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include <AsyncJson.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <LittleFS.h>
#include <ezButton.h>
#include <logs.h>

#define SPIFFS LittleFS

#define RELAY1 32
#define RELAY2 33
// Reset button
#define RST_BTN 34

// Radar GPIOs
#define RX1 36
#define TX1 4
#define TRIGGER_PIN 16

#define DEBOUNCE_TIME 20

extern HardwareSerial USE_SERIAL1;

extern AsyncWebSocket ws;

extern ezButton triggerPin;

extern bool changed_network_config;
extern bool restart_flag;

void restartSequence(unsigned int);

void listAllFiles();

void setPins();