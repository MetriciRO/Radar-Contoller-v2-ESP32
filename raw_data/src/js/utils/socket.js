let socket; // Declare the WebSocket variable
import * as model from "../model.js";
import { async } from "regenerator-runtime";
import { getCurrentURI, ROUTES } from "./config.js";
import Settings from "../pages/Settings.js";
import User from "../pages/User.js";
import Logs from "../views/Logs.js";

export async function setupWebSocket() {
  try {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // console.log("WebSocket connection is already open");
      return;
    }
    // Get the server IP from the settings
    const serverIP = model.state.network_settings.ip_address;

    // Establish a WebSocket connection
    socket = new WebSocket(`ws://${serverIP}/ws`);

    socket.onopen = function (event) {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = async function (event) {
      // Handle incoming WebSocket messages (log updates)
      const logMessage = event.data;
      // console.log("Received WebSocket message:", logMessage);
      if (logMessage === "laser") {
        const uri = getCurrentURI();
        let page = ROUTES[uri] ? ROUTES[uri] : Dashboard;

        if (page === User) {
          await model.getLogs();
          Logs.render(model.state);
        }

        if (page === Settings) {
          await model.getLiveState();
          model.updateLaserHTML();
          Logs.render(model.state);
        } else {
          await model.renderLiveState(uri);
        }
      }
    };

    socket.onclose = function (event) {
      console.log("WebSocket connection closed");
    };

    socket.onerror = function (error) {
      console.error("WebSocket error:", error);
    };
  } catch (error) {
    console.log("Error setting up WebSocket:", error);
  }
}
