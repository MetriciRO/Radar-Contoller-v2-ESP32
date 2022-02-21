#pragma once

#include "common.h"

class Relay
{
public:
    String state;
    String timer;
    bool manual_close;
    unsigned long start_timer;
    unsigned long delta_timer;
    void setTimer(String x);
    int getTimer();

    Relay();
};

extern Relay relay1;