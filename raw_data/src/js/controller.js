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

const init = function () {
  for (const evt of ['hashchange', 'load']) {
    window.addEventListener(evt, myRouter.router);
  }

  // waitForElm('#logs_wrapper').then(() => Logs.render(model.state));
};

init();
