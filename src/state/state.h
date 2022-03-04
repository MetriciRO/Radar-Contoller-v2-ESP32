#pragma once

#include <WiFi.h>
#include <ETH.h>

#include <common.h>
#include <state/radar_state.h>
#include <state/network_state.h>
// #include <state/relay_state.h>
#include <state/user_state.h>

// Get settings from state and returns a json document to be sent to /api/settings/get
StaticJsonDocument<1024> getState();

// Updates live state
void updateState(StaticJsonDocument<1024> &doc);

// Updates relays state
// void updateRelay(StaticJsonDocument<384> json);

// Reads settings from /config.json and updates live state
StaticJsonDocument<1024> initializeConfigJSON();

// Saves settings to /config.json
void saveSettings(StaticJsonDocument<384>, String);

// Writes passed json doc to /config.json after a reset or an update then updates live state
bool JSONtoSettings(StaticJsonDocument<1024>);

// Resets settings but keeps Network Configuration
StaticJsonDocument<1024> softReset();

// Resets all settings
StaticJsonDocument<1024> factoryReset();