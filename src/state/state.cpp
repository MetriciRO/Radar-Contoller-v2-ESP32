#include <state/state.h>

void updateState(StaticJsonDocument<1024> &doc)
{
    // serializeJsonPretty(doc, Serial);
    // Serial.println("\n");
    // if (doc.isNull())
    //     return;

    network_settings.connection = doc["network_settings"]["connection"] | "Not working";
    network_settings.ip_type = doc["network_settings"]["ip_type"] | "Not working";

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
    if (network_settings.ip_type == "Static")
    {
        network_settings.ip_address = doc["network_settings"]["ip_address"] | "Not working";
        network_settings.gateway = doc["network_settings"]["gateway"] | "Not working";
        network_settings.subnet = doc["network_settings"]["subnet"] | "Not working";
        network_settings.dns = doc["network_settings"]["dns"] | "Not working";
    }

    doc["network_settings"]["mac_address_wifi"] = WiFi.macAddress();
    doc["network_settings"]["mac_address_eth"] = ETH.macAddress();

    radar_settings.server_address = doc["radar_settings"]["server_address"] | "Not working";
    radar_settings.server_port = doc["radar_settings"]["server_port"] | "Not working";
    radar_settings.detection_direction = doc["radar_settings"]["detection_direction"] | "Not working";
    radar_settings.detection_threshold = doc["radar_settings"]["detection_threshold"] | "Not working";
    radar_settings.speed_units = doc["radar_settings"]["speed_units"] | "Not working";
    radar_settings.trigger_speed = doc["radar_settings"]["trigger_speed"] | "Not working";
    radar_settings.laser_state = doc["radar_settings"]["laser_state"] | "Not working";

    user.setUsername(doc["user"]["username"] | "Not working");
    user.setUserPassword(doc["user"]["password"] | "Not working");
}

StaticJsonDocument<1024> createJSONfromFile()
{
    StaticJsonDocument<1024> doc;
    // Open file to read
    File file = SPIFFS.open("/config.json");
    if (!file)
    {
        logOutput("ERROR(1): Failed to read file configuration.");
        Serial.println("Could not open file to read config !!!");
        doc.clear();
        return doc;
    }

    int file_size = file.size();
    if (file_size > 1024)
    {
        logOutput("ERROR(2): Failed to read file configuration.");
        Serial.println("Config file bigger than JSON document. Alocate more capacity !");
        doc.clear();
        file.close();
        return doc;
    }

    // Deserialize file to JSON document
    DeserializationError error = deserializeJson(doc, file);
    if (error)
    {
        logOutput("ERROR(3): Failed to read file configuration.");
        Serial.println("Failed to deserialize file to JSON document.");
        Serial.println(error.c_str());
        doc.clear();
        file.close();
        return doc;
    }

    file.close();

    return doc;
}

bool writeJSONtoFile(StaticJsonDocument<1024> doc)
{
    // Open file to write
    File file = SPIFFS.open("/config.json", "w");
    if (!file)
    {
        logOutput("(1)ERROR: Failed to reset. Try again.");
        Serial.println("Could not open file to write config !!!");
        return false;
    }

    // Serialize JSON document to file
    if (serializeJsonPretty(doc, file) == 0)
    {
        doc.clear();
        file.close();
        logOutput("(2)ERROR: Failed to reset. Try again.");
        Serial.println("Failed to write to file");
        return false;
    }

    doc.clear();
    file.close();

    return true;
}

void saveSettings(StaticJsonDocument<384> newDataJSON, String key)
{
    // 1. Create JSON from current /config.json
    StaticJsonDocument<1024> currentConfig = createJSONfromFile();
    if (currentConfig.isNull())
        return;

    // 2. Replace key[value] from previously created JSON with POSTed data
    for (JsonPair i : newDataJSON.as<JsonObject>())
    {
        String nested_key = i.key().c_str();
        String value = i.value().as<String>();
        value.trim();
        value.toLowerCase();

        Serial.print(nested_key);
        Serial.print(": ");
        Serial.println(value);

        // // In case of nested objects:
        // String nested_key = i.key().c_str();
        // String nested_value = json[key][nested_key].as<String>();
        // nested_value.trim();
        // nested_value.toLowerCase();
        // // Serial.print("nested_value : '");
        // // Serial.print(nested_value);
        // // Serial.println("'");

        // If received value is empty then don't change it in /config.json
        if (value.length() == 0)
        {
            // if (nested_key == "username" || nested_key == "password")
            //     currentConfig[key][nested_key] = "";
        }
        // Reset settings to default values when user enters "reset"
        else if (value == "reset")
        {
            if (nested_key == "detection_direction")
                currentConfig[key][nested_key] = "Towards";
            else if (nested_key == "detection_threshold")
                currentConfig[key][nested_key] = "0.15";
            else if (nested_key == "speed_units")
                currentConfig[key][nested_key] = "KPH";
            else if (nested_key == "trigger_speed")
                currentConfig[key][nested_key] = "30";
            else
                currentConfig[key][nested_key] = "";
        }
        else
        {
            currentConfig[key][nested_key] = newDataJSON[nested_key];
        }
    }

    // 3. Write JSON Document to /config.json
    if (!writeJSONtoFile(currentConfig))
        return;

    // Update state objects
    updateState(currentConfig);

    currentConfig.clear();
}

StaticJsonDocument<1024> getState()
{
    StaticJsonDocument<1024> doc;

    doc["network_settings"]["connection"] = network_settings.connection;
    doc["network_settings"]["ip_type"] = network_settings.ip_type;
    // doc["network_settings"]["ssid"] = network_settings.ssid;
    // doc["network_settings"]["password"] = network_settings.password;

    doc["network_settings"]["ip_address"] = network_settings.ip_address;
    doc["network_settings"]["gateway"] = network_settings.gateway;
    doc["network_settings"]["subnet"] = network_settings.subnet;
    doc["network_settings"]["dns"] = network_settings.dns;
    doc["network_settings"]["mac_address_eth"] = ETH.macAddress();

    doc["radar_settings"]["server_address"] = radar_settings.server_address;
    doc["radar_settings"]["server_port"] = radar_settings.server_port;
    doc["radar_settings"]["detection_direction"] = radar_settings.detection_direction;
    doc["radar_settings"]["detection_threshold"] = radar_settings.detection_threshold;
    doc["radar_settings"]["speed_units"] = radar_settings.speed_units;
    doc["radar_settings"]["trigger_speed"] = radar_settings.trigger_speed;
    doc["radar_settings"]["laser_state"] = radar_settings.laser_state;

    doc["user"]["username"] = user.getUsername();
    doc["user"]["password"] = user.getUserPassword();

    return doc;
}

StaticJsonDocument<1024> softReset()
{
    StaticJsonDocument<1024> doc;

    doc["network_settings"]["connection"] = network_settings.connection;
    doc["network_settings"]["ip_type"] = network_settings.ip_type;
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

    doc["radar_settings"]["server_address"] = "";
    doc["radar_settings"]["server_port"] = "";
    doc["radar_settings"]["detection_direction"] = "";
    doc["radar_settings"]["detection_threshold"] = "";
    doc["radar_settings"]["speed_units"] = "";
    doc["radar_settings"]["trigger_speed"] = "";
    doc["radar_settings"]["laser_state"] = "Off";

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

    doc["network_settings"]["ip_address"] = "192.168.0.100";
    doc["network_settings"]["gateway"] = "192.168.0.1";
    // doc["network_settings"]["ip_address"] = "192.168.100.10";
    // doc["network_settings"]["gateway"] = "192.168.100.1";
    doc["network_settings"]["subnet"] = "255.255.255.0";
    doc["network_settings"]["dns"] = "8.8.8.8";

    doc["radar_settings"]["server_address"] = "";
    doc["radar_settings"]["server_port"] = "";
    doc["radar_settings"]["detection_direction"] = "";
    doc["radar_settings"]["detection_threshold"] = "";
    doc["radar_settings"]["speed_units"] = "";
    doc["radar_settings"]["trigger_speed"] = "";
    doc["radar_settings"]["laser_state"] = "Off";

    doc["user"]["username"] = "";
    doc["user"]["password"] = "";

    logOutput("Factory Resetting ...");

    return doc;
}

bool initializeState()
{
    // 1. Read from /config.json
    StaticJsonDocument<1024> doc = createJSONfromFile();
    if (doc.isNull())
        return false;
    // 2. Update state object
    updateState(doc);
    return true;
}