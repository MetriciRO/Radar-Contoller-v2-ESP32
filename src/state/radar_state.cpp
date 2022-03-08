#include <state/radar_state.h>

Radar::Radar() : server_address("192.168.15.25"), server_port("10001"),
                 detection_direction("Towards"), detection_threshold("0.15"),
                 speed_units("KPH"), trigger_speed("30"), laser_state("Off"){};

Radar radar_settings;