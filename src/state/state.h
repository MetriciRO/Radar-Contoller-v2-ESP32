#pragma once

#include <WiFi.h>
#include <ETH.h>

#include <common.h>
#include <state/radar_state.h>
#include <state/network_state.h>
// #include <state/relay_state.h>
#include <state/user_state.h>

// Updates state objects
void updateState(StaticJsonDocument<1024> &doc);

// Create JSON Document from /config.json
StaticJsonDocument<1024> createJSONfromFile();

// Write JSON Document to /config.json
bool writeJSONtoFile(StaticJsonDocument<1024>);

// Saves settings to /config.json
void saveSettings(StaticJsonDocument<384>, String);

// Get settings from state objects and returns a JSON Document to be sent to /api/settings/get
StaticJsonDocument<1024> getState();

// Resets settings but keeps Network Configuration
StaticJsonDocument<1024> softReset();

// Resets all settings
StaticJsonDocument<1024> factoryReset();

// Initialize state objects at boot or after a successful update
bool initializeState();

// Updates relays state
// void updateRelay(StaticJsonDocument<384> json);