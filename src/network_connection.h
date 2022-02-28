#pragma once

#include <state/state.h>
#include <esp_wifi.h>

void WiFiEvent(WiFiEvent_t);

void ethConnection();

void wifiConnection();

// Connect to a network
void startConnection();