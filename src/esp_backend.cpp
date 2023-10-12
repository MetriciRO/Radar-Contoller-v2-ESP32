#include <esp_backend.h>

AsyncWebServer server(80);

void handleUpload(AsyncWebServerRequest *request, const String &filename,
                  size_t index, uint8_t *data, size_t len, bool final) {
  StaticJsonDocument<1024> currentConfig = getState();
  String ip = currentConfig["network_settings"]["ip_address"].as<String>();

  String updateError =
      (String) "<div style=\"margin:0 auto; text-align:center; "
               "font-family:arial;\">ERROR ! </br> Could not update the device "
               "! </br> Please try again ! </br><a href=\"http://" +
      ip + "\">Go back</a></div>";

  String updateSuccess =
      (String) "<div style=\"margin:0 auto; text-align:center; "
               "font-family:arial;\">Congratulation ! </br> You have "
               "successfully updated the device to the latest version. "
               "</br>Please wait 10 seconds before navigating to <a "
               "href=\"http://" +
      ip + "\">" + ip + "</a></div>";

  if (filename.indexOf(".bin") > 0) {
    if (!index) {
      logOutput("The update process has started...");
      // if filename includes littlefs, update the littlefs partition
      int cmd = (filename.indexOf("littlefs") > -1) ? U_SPIFFS : U_FLASH;
      if (!Update.begin(UPDATE_SIZE_UNKNOWN, cmd)) {
        Update.printError(Serial);
        request->send(200, "text/html", updateError);
      }
    }

    if (Update.write(data, len) != len) {
      Update.printError(Serial);
      request->send(200, "text/html", updateError);
    }

    if (final) {
      if (!Update.end(true)) {
        Update.printError(Serial);
        request->send(200, "text/html", updateError);
      } else // Update Succeeded
      {
        if (filename.indexOf("littlefs") > -1) // update littlefs.bin
        {
          if (!writeJSONtoFile(currentConfig)) {
            request->send(200, "text/html", updateError);
            restart_flag = true;
          }
          request->send(200, "text/html", updateSuccess);
          restart_flag = true;
        } else // update firmware.bin
        {
          request->send(200, "text/html", updateSuccess);
          restart_flag = true;
        }
        logOutput("Update complete !!!");
      }
    }
  } else if (filename == "config.json") {
    if (!index) {
      // logOutput((String) "Started uploading: " + filename);
      // open the file on first call and store the file handle in the request
      // object
      request->_tempFile = SPIFFS.open("/" + filename, "w");
    }
    if (len) {
      // stream the incoming chunk to the opened file
      request->_tempFile.write(data, len);
    }
    if (final) {
      logOutput((String)filename + " was successfully uploaded !");
      Serial.println((String) "File size: " + index + len);
      // close the file handle as the upload is now done
      request->_tempFile.close();

      if (!initializeState()) {
        logOutput(
            "ERROR: Could not update configuration from file. Restarting...");
        restart_flag = true;
      }

      request->send(
          200, "text/html",
          (String) "<div style=\"margin:0 auto; text-align:center; "
                   "font-family:arial;\">Congratulation ! </br> config.json "
                   "has been uploaded. </br>Please wait 10 seconds before "
                   "navigating to  <a href=\"http://" +
              network_settings.ip_address + "\">" +
              network_settings.ip_address + "</a></div>");
      restart_flag = true;
    }
  }
}

// POST
AsyncCallbackJsonWebHandler *network_handler = new AsyncCallbackJsonWebHandler(
    "/api/network/post", [](AsyncWebServerRequest *request, JsonVariant &json) {
      StaticJsonDocument<384> network_data;
      if (json.is<JsonArray>()) {
        network_data = json.as<JsonArray>();
      } else if (json.is<JsonObject>()) {
        network_data = json.as<JsonObject>();
      }

      saveSettings(network_data, "network_settings");
      // Serial.print('\n');
      // Serial.println("Received Settings: ");
      // serializeJsonPretty(network_data, Serial);
      // Serial.print('\n');
      network_data.clear();
      String response = "http://" + network_settings.ip_address;
      request->send(200, "text/plain", response);

      changed_network_config = true;
    });

AsyncCallbackJsonWebHandler *radar_handler = new AsyncCallbackJsonWebHandler(
    "/api/radar/post", [](AsyncWebServerRequest *request, JsonVariant &json) {
      StaticJsonDocument<384> radar_data;
      if (json.is<JsonArray>()) {
        radar_data = json.as<JsonArray>();
      } else if (json.is<JsonObject>()) {
        radar_data = json.as<JsonObject>();
      }

      saveSettings(radar_data, "radar_settings");
      sendToRadar();
      // Serial.print('\n');
      // Serial.println("Received Settings: ");
      // serializeJsonPretty(radar_data, Serial);
      // Serial.print('\n');
      radar_data.clear();
      request->send(200, "text/plain", "Radar Settings uploaded.");
    });

AsyncCallbackJsonWebHandler *user_handler = new AsyncCallbackJsonWebHandler(
    "/api/user/post", [](AsyncWebServerRequest *request, JsonVariant &json) {
      StaticJsonDocument<384> user_data;
      if (json.is<JsonArray>()) {
        user_data = json.as<JsonArray>();
      } else if (json.is<JsonObject>()) {
        user_data = json.as<JsonObject>();
      }

      saveSettings(user_data, "user");
      // Serial.print('\n');
      // Serial.println("Received Settings: ");
      // serializeJsonPretty(user_data, Serial);
      // Serial.print('\n');
      user_data.clear();
      restart_flag = true;
      request->send(200, "text/plain", "User Settings changed.");
    });

// Main server function
void startEspServer() {
  // Set up WebSocket event handlers
  ws.onEvent([](AsyncWebSocket *server, AsyncWebSocketClient *client,
                AwsEventType type, void *arg, uint8_t *data, size_t len) {
    if (type == WS_EVT_CONNECT) {
      // Client connected, you can send initial data if needed
    } else if (type == WS_EVT_DISCONNECT) {
      // Client disconnected
    }
  });
  server.addHandler(&ws);

  server.on("/api/settings/get", HTTP_GET, [](AsyncWebServerRequest *request) {
    // if (user.user_flag())
    // {
    //     if (!request->authenticate(user.getUsername().c_str(),
    //     user.getUserPassword().c_str()))
    //         return request->requestAuthentication(NULL, false);
    // }
    StaticJsonDocument<1024> json = getState();

    // Serial.print('\n');
    // Serial.println("Sent settings: /api/get/settings ");
    // serializeJsonPretty(json, Serial);
    // Serial.print('\n');

    String response;
    serializeJson(json, response);
    json.clear();
    request->send(200, "application/json", response);
  });

  server.on("/laser/on", HTTP_GET, [](AsyncWebServerRequest *request) {
    radar_settings.laser_state = "On";
    digitalWrite(RELAY1, HIGH);
    logOutput("Laser is ON");
    ws.textAll("laser");
    request->send(200, "text/plain", "Laser is ON");
  });

  server.on("/laser/off", HTTP_GET, [](AsyncWebServerRequest *request) {
    radar_settings.laser_state = "Off";
    digitalWrite(RELAY1, LOW);
    logOutput("Laser is OFF");
    ws.textAll("laser");
    request->send(200, "text/plain", "Laser is OFF");
  });

  server.on("/api/backup", HTTP_GET, [](AsyncWebServerRequest *request) {
    // Write current state in /config.json
    StaticJsonDocument<1024> doc = getState();
    if (!writeJSONtoFile(doc)) {
      logOutput(
          "Could not backup current configuration. Try again after restart.");
      request->send(200);
    } else {
      request->send(SPIFFS, "/config.json", String(), true);
    }
  });

  server.on("/api/soft-reset", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<1024> json = softReset();

    if (!writeJSONtoFile(json)) {
      request->send(500, "text/plain", "Couldn't reset the device !");
      restart_flag = true;
    }
    logOutput("Soft reset succeeded !");
    request->send(200, "text/plain", "Soft reset succeeded !");
    restart_flag = true;
  });

  server.on("/api/factory-reset", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<1024> json = factoryReset();

    if (!writeJSONtoFile(json)) {
      request->send(500, "text/plain", "Couldn't reset the device !");
      restart_flag = true;
    }
    logOutput("Factory reset succeeded !");
    String response = "http://" + network_settings.ip_address;
    request->send(200, "text/plain", response);
    restart_flag = true;
  });

  server.on("/api/restart", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "Radar will restart in 2 seconds");
    restart_flag = true;
  });

  server.on("/api/logs", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", circle.print());
  });

  server.on("/api/debug", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/html", debugBuffer.print());
  });

  server.addHandler(network_handler);
  server.addHandler(radar_handler);
  server.addHandler(user_handler);

  if (user.user_flag()) {
    server.serveStatic("/", SPIFFS, "/index.html")
        .setAuthentication(user.getUsername().c_str(),
                           user.getUserPassword().c_str());
    // Force the file to be cached for no longer than 1 day
    server.serveStatic("/", SPIFFS, "/")
        .setCacheControl("max-age=86400, must-revalidate")
        .setAuthentication(user.getUsername().c_str(),
                           user.getUserPassword().c_str());
  } else {
    server.serveStatic("/", SPIFFS, "/index.html");
    server.serveStatic("/", SPIFFS, "/")
        .setCacheControl("max-age=86400, must-revalidate");
  }
  server.rewrite("/", "/index.html");

  server.onNotFound([](AsyncWebServerRequest *request) { request->send(404); });

  server.onFileUpload(handleUpload);
  server.begin();
}