#pragma once

#include <state/state.h>
#include <common.h>

// create UDP instance
extern WiFiUDP udp;
// create TCP Server
extern WiFiServer TCPserver;

extern String radar_serial_output;
extern String port_old;

extern unsigned int start_timer_serial;
extern unsigned int delta_timer_serial;
extern bool trigger;

// Default initizaliation for the radar
void initializeRadar();
// Send commands to radar
void sendToRadar();
// TCP and UDP routines between Server, ESP and Radar
void radarRoutine();
// Check if we are receiving serial data from Radar
void testRadarSerial();