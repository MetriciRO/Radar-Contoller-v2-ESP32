import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { waitForElm } from './utils/helpers.js';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import User from './pages/User';

import Navbar from './views/Navbar';
import Logs from './views/Logs';

class Router {
  _routes = {
    '/': Dashboard,
    '/settings': Settings,
    '/user': User,
  };

  router = async () => {
    // Get the parsed URl from the addressbar
    let url = '/' + window.location.hash.slice(1).toLowerCase() || '/';
    // console.log('url:', url);

    // Get live state from server on boot-up
    await model.getLiveState();

    // Render the Header and footer of the page
    Navbar.render(url);

    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, redirect to Dashboard
    let page = this._routes[url] ? this._routes[url] : Dashboard;
    // console.log('page:', page);
    page.render(model.state);
    Logs.render(model.state);
  };
}

const myRouter = new Router();

// View sends form data to Controller
// Controller sends data to model
// Model update state
// Controller renders new state

const controllerUploadData = async function (new_data, which_data) {
  await model.uploadData(new_data, which_data);
  // 1. Upload new data to server
  // 2. Update model.state
  // 3. Update Views
};

const init = function () {
  for (const evt of ['hashchange', 'load']) {
    window.addEventListener(evt, myRouter.router);
  }
  Settings.addHandlerUpload(controllerUploadData);
};

init();
