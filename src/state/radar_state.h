#pragma once

#include <common.h>

class Radar
{
public:
    // UDP Credentials
    String server_address;
    String server_port;
    // Radar parameters
    String detection_direction;
    String detection_threshold;
    String speed_units;
    String trigger_speed;
    // Laser State (Relay 1 [GPIO 32])
    String laser_state;
    Radar();
};
extern Radar radar_settings;