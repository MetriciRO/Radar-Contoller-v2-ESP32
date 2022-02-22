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

    // Render the Header and footer of the page
    await Navbar.render(url);
    await Logs.render();

    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, redirect to Dashboard
    let page = this._routes[url] ? this._routes[url] : Dashboard;
    // console.log('page:', page);
    await page.render();
  };
}

export default new Router();
