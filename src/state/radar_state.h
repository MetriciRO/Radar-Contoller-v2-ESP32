#pragma once

#include <common.h>

class Radar
{
public:
    String units;
    String trigger_speed;
    String direction;
    String threshold;
};
extern Radar radar;