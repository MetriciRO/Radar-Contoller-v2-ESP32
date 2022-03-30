#include <state/state.h>
#include <network_connection.h>
#include <esp_backend.h>
#include <radar_coms.h>

void checkResetBtn()
{
  int q = 0;
  if (digitalRead(RST_BTN) == LOW)
  {
    q++;
    delay(2000);
    if (digitalRead(RST_BTN) == LOW)
    {
      q++;
    }
  }

  if (q == 2)
  {
    logOutput("WARNING: Reset button was pressed !");
    StaticJsonDocument<1024> json = factoryReset();
    if (writeJSONtoFile(json))
    {
      restartSequence(2);
    }
    else
    {
      logOutput("ERROR: Could not factory reset. Please restart the device and try again !");
    }
  }

  q = 0;
}

void setup()
{
  enableCore1WDT();
  delay(100);
  Serial.begin(115200);
  delay(100);
  USE_SERIAL1.begin(9600, SERIAL_8N1, RX1, TX1);
  delay(100);

  if (!SPIFFS.begin(true))
  {
    Serial.println(F("An Error has occurred while mounting SPIFFS ! Formatting in progress"));
    return;
  }

  setPins();

  checkResetBtn();

  // Read settings from /config.json and update live state
  if (!initializeState())
  {
    logOutput("ERROR: Could not get start-up configuration. Restarting...");
    restartSequence(5);
  }
  // Send default settings to radar at boot
  initializeRadar();
  // Send settings from config.json to radar at boot
  sendToRadar();
  // Connect to a network
  startConnection();
  // Start back-end server
  startEspServer();

  Serial.print("WiFi MAC - ");
  Serial.println(WiFi.macAddress());
  Serial.print("ETH MAC - ");
  Serial.println(ETH.macAddress());
}

void loop()
{
  delay(1);
  if (changed_network_config)
  {
    logOutput("Changed NETWORK configuration. Restarting...");
    restartSequence(3);
  }
  if (restart_flag)
  {
    Serial.println("Changed other configuration. Restarting...");
    restartSequence(3);
  }

  // radarRoutine();

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

