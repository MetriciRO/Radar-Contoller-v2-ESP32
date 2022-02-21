#include <state.h>

StaticJsonDocument<1024> getLiveState()
{
    StaticJsonDocument<1024> doc;

    doc["network_settings"]["connection"] = network_settings.connection;
    doc["network_settings"]["ip_type"] = network_settings.ip_type;
    doc["network_settings"]["ssid"] = network_settings.ssid;
    doc["network_settings"]["password"] = network_settings.password;

    doc["network_settings"]["mac_address_wifi"] = WiFi.macAddress();
    doc["network_settings"]["mac_address_eth"] = ETH.macAddress();
    doc["network_settings"]["ip_address"] = network_settings.ip_address;
    doc["network_settings"]["gateway"] = network_settings.gateway;
    doc["network_settings"]["subnet"] = network_settings.subnet;
    doc["network_settings"]["dns"] = network_settings.dns;

    doc["user"]["username"] = user.getUsername();
    doc["user"]["password"] = user.getUserPassword();

    return doc;
}

void updateLiveState(StaticJsonDocument<1024> &doc)
{
    // serializeJsonPretty(doc, Serial);
    // Serial.println("\n");

    network_settings.connection = doc["network_settings"]["connection"] | "Not working";
    network_settings.ip_type = doc["network_settings"]["ip_type"] | "Not working";
    if (network_settings.connection == "WiFi")
    {
        network_settings.ssid = doc["network_settings"]["ssid"] | "Not working";
        network_settings.password = doc["network_settings"]["password"] | "Not working";

        if (network_settings.ip_type == "DHCP")
        {
            network_settings.ip_address = WiFi.localIP().toString();
            doc["network_settings"]["ip_address"] = network_settings.ip_address;

            network_settings.gateway = WiFi.gatewayIP().toString();
            doc["network_settings"]["gateway"] = network_settings.gateway;

            network_settings.subnet = WiFi.subnetMask().toString();
            doc["network_settings"]["subnet"] = network_settings.subnet;

            network_settings.dns = WiFi.dnsIP().toString();
            doc["network_settings"]["dns"] = network_settings.dns;
        }
    }
    else if (network_settings.connection == "Ethernet")
    {
        network_settings.ssid = "";
        network_settings.password = "";

        if (network_settings.ip_type == "DHCP")
        {
            network_settings.ip_address = ETH.localIP().toString();
            doc["network_settings"]["ip_address"] = network_settings.ip_address;

            network_settings.gateway = ETH.gatewayIP().toString();
            doc["network_settings"]["gateway"] = network_settings.gateway;

            network_settings.subnet = ETH.subnetMask().toString();
            doc["network_settings"]["subnet"] = network_settings.subnet;

            network_settings.dns = ETH.dnsIP().toString();
            doc["network_settings"]["dns"] = network_settings.dns;
        }
    }

    doc["network_settings"]["mac_address_wifi"] = WiFi.macAddress();
    doc["network_settings"]["mac_address_eth"] = ETH.macAddress();

    if (network_settings.ip_type == "Static")
    {
        network_settings.ip_address = doc["network_settings"]["ip_address"] | "Not working";
        network_settings.gateway = doc["network_settings"]["gateway"] | "Not working";
        network_settings.subnet = doc["network_settings"]["subnet"] | "Not working";
        network_settings.dns = doc["network_settings"]["dns"] | "Not working";
    }

    user.setUsername(doc["user"]["username"] | "Not working");
    user.setUserPassword(doc["user"]["password"] | "Not working");
}

StaticJsonDocument<1024> readSettings()
{
    StaticJsonDocument<1024> doc;
    // Open file to read
    File file = SPIFFS.open("/config.json");
    if (!file)
    {
        logOutput("ERROR: Failed to get configuration.");
        Serial.println("Could not open file to read config !!!");
        doc.clear();
        return doc;
    }

    int file_size = file.size();
    if (file_size > 1024)
    {
        logOutput("ERROR: Failed to get configuration.");
        Serial.println(F("Config file bigger than JSON document. Alocate more capacity !"));
        doc.clear();
        file.close();
        return doc;
    }

    // Deserialize file to JSON document
    DeserializationError error = deserializeJson(doc, file);
    if (error)
    {
        logOutput("ERROR: Failed to get configuration.");
        Serial.println("Failed to deserialize file to JSON document.");
        Serial.println(error.c_str());
        doc.clear();
        file.close();
        return doc;
    }

    file.close();

    updateLiveState(doc);
    // serializeJsonPretty(doc, Serial);

    return doc;
}

// Save settings in /config.json
void saveSettings(StaticJsonDocument<384> json, String key)
{
    StaticJsonDocument<1024> doc;
    File file = SPIFFS.open("/config.json", "r");
    if (!file)
    {
        logOutput("(1)ERROR: Failed to save settings. Try again.");
        Serial.println("Could not open file to read config !!!");
        return;
    }

    int file_size = file.size();
    if (file_size > 1024)
    {
        logOutput("(2)ERROR: Failed to save settings. Try again.");
        Serial.println("Config file bigger than JSON document. Alocate more capacity !");
        doc.clear();
        return;
    }

    // Deserialize file to JSON document
    DeserializationError error = deserializeJson(doc, file);
    if (error)
    {
        logOutput("(3)ERROR: Failed to save settings. Try again.");
        Serial.println("Failed to read file, using default configuration");
        return;
    }

    file.close();
    String nested_key = "";

    for (JsonPair i : json[key].as<JsonObject>())
    {
        nested_key = i.key().c_str();
        String nested_value = json[key][nested_key].as<String>();
        nested_value.trim();
        nested_value.toLowerCase();
        // Serial.print("nested_value : '");
        // Serial.print(nested_value);
        // Serial.println("'");

        // if received value is empty or 'not set' then don't change it in /config.json
        if (nested_value.length() == 0)
        {
            if (nested_key == "username" || nested_key == "password")
                doc[key][nested_key] = "";
        }
        // Set default values when user enters "not set"
        else if (nested_value == "not set")
        {
            if (nested_key == "timer1" || nested_key == "timer2")
                doc[key][nested_key] = "0";
            else if (nested_key == "pulse_width" || nested_key == "pulse_gap")
                doc[key][nested_key] = "90";
            else
                doc[key][nested_key] = "not set";
        }
        else
        {
            doc[key][nested_key] = json[key][nested_key];
            // if (nested_key == "ip_rfid" || nested_key == "port_rfid")
            // {
            //     doc[key][nested_key] = "";
            //     rfid.activate_rfid = true;
            // }
        }
    }

    file = SPIFFS.open("/config.json", "w");
    if (!file)
    {
        logOutput("(4)ERROR: Failed to save settings. Try again.");
        Serial.println("Could not open file to read config !!!");
        return;
    }

    // Serialize JSON document to file
    if (serializeJsonPretty(doc, file) == 0)
    {
        doc.clear();
        file.close();
        logOutput("(5)ERROR: Failed to save settings. Try again.");
        Serial.println("Failed to write to file");
        return;
    }
    // Update Live state
    updateLiveState(doc);

    doc.clear();
    file.close();
}

StaticJsonDocument<1024> softReset()
{
    StaticJsonDocument<1024> doc;

    doc["network_settings"]["connection"] = network_settings.connection;
    doc["network_settings"]["ip_type"] = network_settings.ip_type;
    if (network_settings.connection == "WiFi")
    {
        doc["network_settings"]["ssid"] = network_settings.ssid;
        doc["network_settings"]["password"] = network_settings.password;
    }
    if (network_settings.connection == "Ethernet")
    {
        network_settings.ssid = "Ethernet Connection";
        network_settings.password = "Ethernet Connection";
    }
    if (network_settings.ip_type == "DHCP")
    {
        doc["network_settings"]["ip_address"] = WiFi.localIP().toString();
        doc["network_settings"]["gateway"] = WiFi.gatewayIP().toString();
        doc["network_settings"]["subnet"] = WiFi.subnetMask().toString();
        doc["network_settings"]["dns"] = WiFi.dnsIP().toString();
    }
    if (network_settings.ip_type == "Static")
    {
        doc["network_settings"]["ip_address"] = network_settings.ip_address;
        doc["network_settings"]["gateway"] = network_settings.gateway;
        doc["network_settings"]["subnet"] = network_settings.subnet;
        doc["network_settings"]["dns"] = network_settings.dns;
    }

    doc["network_settings"]["mac_address_wifi"] = "";
    doc["network_settings"]["mac_address_eth"] = "";

    doc["user"]["username"] = "";
    doc["user"]["password"] = "";

    logOutput("Soft Resetting ...");

    return doc;
}

StaticJsonDocument<1024> factoryReset()
{
    StaticJsonDocument<1024> doc;

    doc["network_settings"]["connection"] = "Ethernet";
    doc["network_settings"]["ip_type"] = "Static";
    doc["network_settings"]["ssid"] = "";
    doc["network_settings"]["password"] = "";

    // doc["network_settings"]["connection"] = "WiFi";
    // doc["network_settings"]["ip_type"] = "Static";
    // doc["network_settings"]["ssid"] = "Jorje-2.4";
    // doc["network_settings"]["password"] = "cafea.amara";

    doc["network_settings"]["ip_address"] = "192.168.0.100";
    doc["network_settings"]["gateway"] = "192.168.0.1";
    // doc["network_settings"]["ip_address"] = "192.168.100.10";
    // doc["network_settings"]["gateway"] = "192.168.100.1";
    doc["network_settings"]["subnet"] = "255.255.255.0";
    doc["network_settings"]["dns"] = "8.8.8.8";

    doc["network_settings"]["mac_address_wifi"] = "";
    doc["network_settings"]["mac_address_eth"] = "";

    doc["user"]["username"] = "";
    doc["user"]["password"] = "";

    logOutput("Factory Resetting ...");

    return doc;
}

bool JSONtoSettings(StaticJsonDocument<1024> doc)
{
    // Open file to write
    File file = SPIFFS.open("/config.json", "w");
    if (!file)
    {
        logOutput("(1)ERROR: Failed to reset. Try again.");
        Serial.println("Could not open file to write config !!!");
        return 0;
    }

    // Serialize JSON document to file
    if (serializeJsonPretty(doc, file) == 0)
    {
        doc.clear();
        file.close();
        logOutput("(2)ERROR: Failed to reset. Try again.");
        Serial.println("Failed to write to file");
        return 0;
    }

    updateLiveState(doc);
    doc.clear();
    file.close();

    return 1;
}