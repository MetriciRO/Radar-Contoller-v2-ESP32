#include <state/relay_state.h>

// Relays state
Relay::Relay() : state(""), manual_close(false), start_timer(0), delta_timer(0){};

void Relay::setTimer(String x)
{
    x.trim();
    if (x == "" && x.length() == 0)
        timer = "0";
    else
        timer = x;
}

int Relay::getTimer()
{
    return timer.toInt();
}

Relay relay1;