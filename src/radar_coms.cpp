#include <radar_coms.h>

void initializeRadar()
{
    USE_SERIAL1.write("SET output1HoldTime 500\r\n");
    delay(10);
    USE_SERIAL1.write("SET output1min 10\r\n");
    delay(10);
    USE_SERIAL1.write("SET output1max 99\r\n");
    delay(10);
    USE_SERIAL1.write("SET output2min 50\r\n");
    delay(10);
    USE_SERIAL1.write("SET output2max 99\r\n");
    delay(10);
}

void sendToRadar()
{
    if (radar_settings.speed_units == "MPH")
    {
        USE_SERIAL1.write("SET speedUnits 0\r\n");
    }
    else if (radar_settings.speed_units == "KPH")
    {
        USE_SERIAL1.write("SET speedUnits 1\r\n");
    }
    delay(10);
    String str_1 = "SET output1min " + radar_settings.trigger_speed + "\r\n";
    USE_SERIAL1.write(str_1.c_str());
    delay(10);
    if (radar_settings.detection_direction == "Towards")
    {
        USE_SERIAL1.write("SET detectionDirection 0\r\n");
    }
    else if (radar_settings.detection_direction == "Away")
    {
        USE_SERIAL1.write("SET detectionDirection 1\r\n");
    }
    else if (radar_settings.detection_direction == "Bidirectional")
    {
        USE_SERIAL1.write("SET detectionDirection 2\r\n");
    }
    delay(10);
    String str_2 = "SET detectionThreshold " + radar_settings.detection_threshold + "\r\n";
    USE_SERIAL1.write(str_2.c_str());
    delay(10);
}

WiFiServer TCPserver(10001);

String radar_serial_output = "";
// String server_address = "0.0.0.0";
// String server_port = "0000"; // server port
String port_old = "";

unsigned int start_timer_serial = 0;
unsigned int delta_timer_serial = 0;
bool trigger = false;

void radarRoutine()
{
    triggerPin.loop();
    // TCP Connection
    WiFiClient client = TCPserver.available();

    // Initialize TCP Connection and send data
    if (client)
    {
        Serial.println((String) "Client IP Address: " + client.remoteIP().toString());
        Serial.println((String) "Client Port: " + client.remotePort());
        logOutput("Client has connected.");
        radar_serial_output = "";
        USE_SERIAL1.flush();
        while (client.connected())
        {
            delta_timer_serial = millis();
            if (restart_flag)
            {
                restartSequence(1);
            }

            // Check if we are receiving serial data from Radar
            if (USE_SERIAL1.available() > 0)
            {
                while (USE_SERIAL1.available())
                {
                    char radar = USE_SERIAL1.read();
                    delay(10);
                    radar_serial_output += radar; // this adds up all the input
                }
                start_timer_serial = millis();
            }
            // Check if received string is a command or not
            // If it's not a command then its a measured speed and we send it to the TCP Client
            if (radar_serial_output.length() != 0 && radar_serial_output.indexOf("SET") < 0)
            {
                client.write(radar_serial_output.c_str());
                logOutput("Measured speed: " + radar_serial_output);
                radar_serial_output = "";
            }
            // If it's a command then clear the string and signal that a setting changed
            else if (radar_serial_output.indexOf("SET") > 0 && radar_serial_output.indexOf("OK") > 0)
            {
                logOutput("Parameter successfully changed.");
                radar_serial_output = "";
            }
            else if ((delta_timer_serial - start_timer_serial) > 1000)
            {
                client.write("0\r\n");
                start_timer_serial = millis();
                radar_serial_output = "";
            }
            else
            {
                radar_serial_output = "";
            }

            // Check for SERVER's PORT and initializes UDP
            if (port_old != radar_settings.server_port && radar_settings.server_port != "0000")
            {
                port_old = radar_settings.server_port;
                Serial.println("New Server Port: " + port_old);
                udp.stop();
                delay(100);
                udp.begin(radar_settings.server_port.toInt());
            }

            // Send UDP packet if trigger was sent from Radar
            if (digitalRead(TRIGGER_PIN) == LOW && trigger == false)
            {
                trigger = true;
                logOutput("Trigger sent");
                uint8_t buffer[19] = "statechange,201,1\r";
                // send packet to server
                if (radar_settings.server_address.length() != 0)
                {
                    udp.beginPacket(radar_settings.server_address.c_str(), radar_settings.server_port.toInt());
                    udp.write(buffer, sizeof(buffer));
                    delay(30);
                    Serial.println(udp.endPacket());
                    memset(buffer, 0, 19);
                }
                else
                {
                    logOutput("ERROR ! No IP for the Server was found. Please enter Server's IP !");
                }
                // delay(520);
            } // if(digitalRead(TRIGGER_PIN) == LOW)

            if (digitalRead(TRIGGER_PIN) == HIGH && trigger == true)
            {
                trigger = false;
            }
        } // while(client.connected())

        client.stop();
        logOutput("Client has disconnected.");
    } // if(client)
}

void testRadarSerial()
{
    // Check if we are receiving serial data from Radar
    if (USE_SERIAL1.available() > 0)
    {
        while (USE_SERIAL1.available())
        {
            char radar = USE_SERIAL1.read();
            delay(10);
            radar_serial_output += radar; // this adds up all the input
        }
        Serial.println(radar_serial_output);
        start_timer_serial = millis();
    }

    if (radar_serial_output.length() != 0 && radar_serial_output.indexOf("SET") < 0)
    {
        // client.write(radar_serial_output.c_str());
        logOutput("Measured speed: " + radar_serial_output);
        radar_serial_output = "";
    }
    else if (radar_serial_output.indexOf("SET") > 0 && radar_serial_output.indexOf("OK") > 0)
    {
        logOutput("Parameter successfully changed.");
        radar_serial_output = "";
    }
    else if ((delta_timer_serial - start_timer_serial) > 1000)
    {
        // client.write("0\r\n");
        start_timer_serial = millis();
        radar_serial_output = "";
    }
    else
    {
        radar_serial_output = "";
    }
}