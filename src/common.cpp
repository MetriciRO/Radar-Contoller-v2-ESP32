#include <common.h>

HardwareSerial USE_SERIAL1(1);
AsyncWebSocket ws("/ws"); // Create a WebSocket instance

bool changed_network_config = false;
bool restart_flag = false;

ezButton triggerPin(TRIGGER_PIN);

void restartSequence(unsigned int countdown)
{
    logOutput((String) "Restarting in: " + countdown + " seconds.");
    for (int i = countdown; i > 0; i--)
    {
        delay(999);
    }
    ESP.restart();
}

void listAllFiles()
{
    File root = SPIFFS.open("/");
    File file = root.openNextFile();
    while (file)
    {
        Serial.print("FILE: ");
        String fileName = file.name();
        Serial.println(fileName);
        file = root.openNextFile();
    }
    file.close();
    root.close();
}

void setPins()
{
    // Relays
    pinMode(RELAY1, OUTPUT);
    pinMode(RELAY2, OUTPUT);
    digitalWrite(RELAY1, LOW);
    digitalWrite(RELAY2, LOW);

    // Trigger Pin and Reset Button
    pinMode(TRIGGER_PIN, INPUT_PULLUP);
    pinMode(RST_BTN, INPUT_PULLUP);

    triggerPin.setDebounceTime(DEBOUNCE_TIME);
}