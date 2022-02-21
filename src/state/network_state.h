#pragma once

#include <common.h>

class Settings
{
public:
    String connection;
    String ip_type;
    String ssid;
    String password;
    String ip_address;
    String gateway;
    String subnet;
    String dns;
    Settings();
};

extern Settings network_settings;
