import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import DashboardView from './views/DashboardView.js';
import Logs from './views/Logs.js';
import Navbar from './views/Navbar.js';

const controlDashboard = async function () {
  try {
    // 1. Get current Network Settings
    await model.getNetworkSettings();
    // 2. Get current Radar Settings
    await model.getRadarSettings();
    // 3. Get current User Settings
    await model.getUser();
    // 4. Render Navbar
    Navbar.render();
    // 5. Render current Settings
    DashboardView.render(model.state);
    // 6. Render Logs
    Logs.render();
  } catch (error) {
    console.error(error);
    // toastify
  }
};

const controlSettings = async function () {
  try {
  } catch (error) {}
};

const init = function () {
  controlDashboard();
};

init();
