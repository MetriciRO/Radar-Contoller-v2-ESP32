#pragma once

#include <state.h>

String radar_command;
String metrici_server_ip;
String metrici_server_port;
String port_old;

unsigned int start_timer_serial;
unsigned int delta_timer_serial;
bool trigger;

void radarRoutine();
void sendToRadar();