#pragma once

#include <state/state.h>
#include <common.h>

extern String radar_command;
extern String port_old;

extern unsigned int start_timer_serial;
extern unsigned int delta_timer_serial;
extern bool trigger;

// Send commands to radar
void sendToRadar();
// TCP and UDP routines between Server, ESP and Radar
void radarRoutine();