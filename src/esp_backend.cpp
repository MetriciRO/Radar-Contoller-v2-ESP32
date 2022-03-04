#include <esp_backend.h>

AsyncWebServer server(80);

void handleUpload(AsyncWebServerRequest *request, const String &filename, size_t index, uint8_t *data, size_t len, bool final)
{
    StaticJsonDocument<1024> currentConfig = getState();
    String ip = currentConfig["network_settings"]["ip_address"].as<String>();

    String updateError = (String) "<div style=\"margin:0 auto; text-align:center; font-family:arial;\">ERROR ! </br> Could not update the device ! </br> Please try again ! </br><a href=\"http://" + ip + "\">Go back</a></div>";

    String updateSuccess = (String) "<div style=\"margin:0 auto; text-align:center; font-family:arial;\">Congratulation ! </br> You have successfully updated the device to the latest version. </br>Please wait 10 seconds before navigating to <a href=\"http://" + ip + "\">" + ip + "</a></div>";

    if (filename.indexOf(".bin") > 0)
    {
        if (!index)
        {
            logOutput("The update process has started...");
            // if filename includes spiffs, update the spiffs partition
            int cmd = (filename.indexOf("spiffs") > -1) ? U_SPIFFS : U_FLASH;
            if (!Update.begin(UPDATE_SIZE_UNKNOWN, cmd))
            {
                Update.printError(Serial);
                request->send(200, "text/html", updateError);
            }
        }

        if (Update.write(data, len) != len)
        {
            Update.printError(Serial);
            request->send(200, "text/html", updateError);
        }

        if (final)
        {
            if (!Update.end(true))
            {
                Update.printError(Serial);
                request->send(200, "text/html", updateError);
            }
            else // Update Succeeded
            {
                if (filename.indexOf("spiffs") > -1) // update spiffs.bin
                {
                    if (!JSONtoSettings(currentConfig))
                    {
                        request->send(200, "text/html", updateError);
                        restart_flag = true;
                    }
                    request->send(200, "text/html", updateSuccess);
                    restart_flag = true;
                }
                else // update firmware.bin
                {
                    request->send(200, "text/html", updateSuccess);
                    restart_flag = true;
                }
                logOutput("Update complete !!!");
            }
        }
    }
    else if (filename == "config.json")
    {
        if (!index)
        {
            // logOutput((String) "Started uploading: " + filename);
            // open the file on first call and store the file handle in the request object
            request->_tempFile = SPIFFS.open("/" + filename, "w");
        }
        if (len)
        {
            // stream the incoming chunk to the opened file
            request->_tempFile.write(data, len);
        }
        if (final)
        {
            logOutput((String)filename + " was successfully uploaded !");
            Serial.println((String) "File size: " + index + len);
            // close the file handle as the upload is now done
            request->_tempFile.close();

            if (initializeConfigJSON().isNull())
            {
                logOutput("ERROR: Could not update configuration from file. Restarting...");
                restart_flag = true;
            }

            request->send(200, "text/html", (String) "<div style=\"margin:0 auto; text-align:center; font-family:arial;\">Congratulation ! </br> config.json has been uploaded. </br>Please wait 10 seconds before navigating to  <a href=\"http://" + network_settings.ip_address + "\">" + network_settings.ip_address + "</a></div>");
            restart_flag = true;
        }
    }
}

// POST
AsyncCallbackJsonWebHandler *network_handler =
    new AsyncCallbackJsonWebHandler("/api/network/post", [](AsyncWebServerRequest *request, JsonVariant &json)
                                    {
                                        StaticJsonDocument<384> network;
                                        if (json.is<JsonArray>())
                                        {
                                            network = json.as<JsonArray>();
                                        }
                                        else if (json.is<JsonObject>())
                                        {
                                            network = json.as<JsonObject>();
                                        }

                                        // saveSettings(network, "network_settings");
                                        Serial.print('\n');
                                        Serial.println("Received Settings: ");
                                        serializeJsonPretty(network, Serial);
                                        Serial.print('\n');
                                        network.clear();
                                        String response = "http://" + network_settings.ip_address;
                                        request->send(200, "text/plain", response);

                                        changed_network_config = true; });

AsyncCallbackJsonWebHandler *radar_handler =
    new AsyncCallbackJsonWebHandler("/api/radar/post", [](AsyncWebServerRequest *request, JsonVariant &json)
                                    {
                                        StaticJsonDocument<384> radar_data;
                                        if (json.is<JsonArray>())
                                        {
                                            radar_data = json.as<JsonArray>();
                                        }
                                        else if (json.is<JsonObject>())
                                        {
                                            radar_data = json.as<JsonObject>();
                                        }

                                        // saveSettings(radar_data, "radar_settings");
                                        Serial.print('\n');
                                        Serial.println("Received Settings: ");
                                        serializeJsonPretty(radar_data, Serial);
                                        Serial.print('\n');
                                        radar_data.clear();
                                        request->send(200, "text/plain", "Radar Settings uploaded."); });

AsyncCallbackJsonWebHandler *user_handler =
    new AsyncCallbackJsonWebHandler("/api/user/post", [](AsyncWebServerRequest *request, JsonVariant &json)
                                    {
                                        StaticJsonDocument<384> user_data;
                                        if (json.is<JsonArray>())
                                        {
                                            user_data = json.as<JsonArray>();
                                        }
                                        else if (json.is<JsonObject>())
                                        {
                                            user_data = json.as<JsonObject>();
                                        }

                                        saveSettings(user_data, "user");
                                        Serial.print('\n');
                                        Serial.println("Received Settings /api/user/post: ");
                                        serializeJsonPretty(user_data, Serial);
                                        Serial.print('\n');
                                        user_data.clear();
                                        // Serial.println(response);
                                        restart_flag = true;
                                        request->send(200, "text/plain", "User Settings changed."); });

// Main server function
void startEspServer()
{
    server.on("/api/settings/get", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                if (user.user_flag())
                {
                    if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                        return request->requestAuthentication(NULL, false);
                }
                StaticJsonDocument<1024> json = getState();

                String response;
                Serial.print('\n');
                Serial.println("Sent settings: /api/get/settings ");
                serializeJsonPretty(json, Serial);
                Serial.print('\n');
                serializeJson(json, response);
                json.clear();
                request->send(200, "application/json", response); });

    server.on("/laser/on", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                if (user.user_flag())
                {
                if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                    return request->requestAuthentication(NULL, false);
                }
                // StaticJsonDocument<384> relay_json;
                // relay_json["relay1"]["state1"] = "On";
                // updateRelay(relay_json);
                // saveSettings(relay_json, "relay1");
                // relay_json.clear();
                
                radar_settings.laser_state = "On";
                digitalWrite(RELAY1, HIGH);
                request->send(200, "text/plain", "Laser is ON"); });

    server.on("/laser/off", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                if (user.user_flag())
                {
                    if (!request->authenticate(user.getUserPassword().c_str(), user.getUserPassword().c_str()))
                        return request->requestAuthentication(NULL, false);
                }
                // StaticJsonDocument<384> relay_json;
                // relay_json["relay1"]["state1"] = "Off";
                // updateRelay(relay_json);
                // saveSettings(relay_json, "relay1");
                // relay_json.clear();

                radar_settings.laser_state = "Off";
                digitalWrite(RELAY1, LOW);
                request->send(200, "text/plain", "Laser is OFF"); });

    server.on("/api/backup", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                  if (user.user_flag())
                  {
                      if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                          return request->requestAuthentication(NULL, false);
                  }
                  request->send(SPIFFS, "/config.json", String(), true); });

    server.on("/api/soft-reset", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                  if (user.user_flag())
                  {
                      if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                          return request->requestAuthentication(NULL, false);
                  }
                  StaticJsonDocument<1024> json = softReset();

                  if (!JSONtoSettings(json))
                  {
                    request->send(500, "text/plain", "Couldn't reset the device !");
                    restart_flag = true;
                  }
                  logOutput("Soft reset succeeded !");
                  request->send(200, "text/plain", "Soft reset succeeded !");
                  restart_flag = true; });

    server.on("/api/factory-reset", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                  if (user.user_flag())
                  {
                      if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                          return request->requestAuthentication(NULL, false);
                  }
                  StaticJsonDocument<1024> json = factoryReset();

                  if (!JSONtoSettings(json))
                  {
                    request->send(500, "text/plain", "Couldn't reset the device !");
                    restart_flag = true;
                  }
                  logOutput("Factory reset succeeded !");
                  String response = "http://" + network_settings.ip_address;
                  request->send(200, "text/plain", response);
                  restart_flag = true; });

    server.on("/api/restart", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                  if (user.user_flag())
                  {
                      if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                          return request->requestAuthentication(NULL, false);
                  }
                  request->send(200, "text/plain", "Multi-Controller will restart in 2 seconds");
                  restart_flag = true; });

    server.on("/api/logs", HTTP_GET, [](AsyncWebServerRequest *request)
              {
                  if (user.user_flag())
                  {
                      if (!request->authenticate(user.getUsername().c_str(), user.getUserPassword().c_str()))
                          return request->requestAuthentication(NULL, false);
                  }
                  circle.print();
                  request->send(200, "text/plain", strlog); });

    server.addHandler(network_handler);
    server.addHandler(radar_handler);
    server.addHandler(user_handler);

    if (user.user_flag())
    {
        // server.serveStatic("/settings", SPIFFS, "/settings.html").setAuthentication(user.getUsername().c_str(), user.getUserPassword().c_str());
        server.serveStatic("/", SPIFFS, "/index.html").setAuthentication(user.getUsername().c_str(), user.getUserPassword().c_str());
        // server.serveStatic("/user", SPIFFS, "/user.html").setAuthentication(user.getUsername().c_str(), user.getUserPassword().c_str());
    }
    else
    {
        // server.serveStatic("/settings", SPIFFS, "/settings.html");
        server.serveStatic("/", SPIFFS, "/index.html");
        // server.serveStatic("/user", SPIFFS, "/user.html");
    }

    server.serveStatic("/", SPIFFS, "/").setCacheControl("max-age=600");
    server.rewrite("/", "/index.html");

    // server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
    //           { request->redirect("/"); });
    server.onNotFound([](AsyncWebServerRequest *request)
                      { request->send(404); });

    server.onFileUpload(handleUpload);
    server.begin();
}