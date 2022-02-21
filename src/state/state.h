#pragma once

#include <WiFi.h>
#include <ETH.h>

#include <common.h>
#include <radar_state.h>
#include <network_state.h>
#include <relay_state.h>
#include <user_state.h>

// Gets settings from live state and returns a json document to be sent to /api/settings/get
StaticJsonDocument<1024> getLiveState();

// Updates live state
void updateLiveState(StaticJsonDocument<1024> &doc);

// Updates relays state
void updateRelay(StaticJsonDocument<384> json);

// Reads settings from /config.json and updates live state
StaticJsonDocument<1024> readSettings();

// Saves settings to /config.json
void saveSettings(StaticJsonDocument<384>, String);

// Writes passed json doc to /config.json after a reset or an update and updates live state
bool JSONtoSettings(StaticJsonDocument<1024>);

// Resets settings but keeps Network Configuration
StaticJsonDocument<1024> softReset();

// Resets all settings
StaticJsonDocument<1024> factoryReset();