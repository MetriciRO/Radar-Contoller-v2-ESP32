import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { checkInputFormat, AJAX } from './utils/helpers.js';
import { IP_FORMAT, NUMBER_FORMAT, URL_FORMAT } from './utils/config.js';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import User from './pages/User';

import Navbar from './views/Navbar';
import Logs from './views/Logs';
import Modal from './views/Modal.js';

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
// Controller sends new state to View
// View re-renders

// Check the format of the IP inputs @change
const controllerInputFormat = function (input) {
  if (input.className.split(' ').includes('ip'))
    return checkInputFormat(input, IP_FORMAT);
  else if (input.className.split(' ').includes('number'))
    return checkInputFormat(input, NUMBER_FORMAT);
  else if (input.className.split(' ').includes('url'))
    return checkInputFormat(input, URL_FORMAT);
  else if (input.className.split(' ').includes('list'))
    return checkInputFormat(input);
  // Return true for radio buttons
  return true;
};

/*
  The user has 3 input posibilities:
    - no input - used to keep(not change) the preious setting;
    - 'not set' - used for resetting the setting
    - a valid input - used  to create or update a setting
*/
const validateForm = function (form) {
  // console.log(form);
  for (const element of form.elements) {
    if (element.placeholder === 'DHCP IP') continue;
    if (!controllerInputFormat(element)) return false;
  }
  return true;
};

const controllerUploadData = async function (form) {
  // 1. Validate form
  if (!validateForm(form)) {
    console.log('Did not validate data');
    return;
  }
  // 2. Get data from form
  const new_data = {
    [form.id]: Object.fromEntries(new FormData(form)),
  };
  console.log(new_data);

  // 1.5 Open modal with data
  // Modal.render(new_data);

  // 3. Upload new data to server
  // await model.uploadData(new_data, form.id);
  // 4. Update model.state
  // 5. Update Views
};

const controllerLaserState = async function (target) {
  console.log(target.value);
  // Upload laser state to server
  await model.sendLaserState(target.value);
  // Update model state
  // Update Views
};

// Enable or disable network inputs based on Connection Type
const controllerIpType = function (target) {
  let ip = document.querySelectorAll('.static');
  let current_placeholder = {};
  ip.forEach((element) => {
    let classList = element.className.split(' ');
    current_placeholder[element.id] = classList[0];
  });
  switch (target.id) {
    case 'dhcp':
      for (const element of ip) {
        element.setAttribute('readonly', '');
        element.value = '';
        element.classList.remove('wrong');
        element.classList.remove('correct');
        element.setAttribute('placeholder', 'DHCP IP');
      }
      break;
    case 'static':
      for (const element of ip) {
        element.removeAttribute('readonly');
        element.setAttribute(
          'placeholder',
          `${current_placeholder[element.id]}`
        );
      }
      break;
    default:
      break;
  }
};

const controllerResetForm = async function (target) {
  if (target.name === 'reset_btn') {
    // Send reset request to server
    await model.sendReset(target);
    // Re-render after reset
    await myRouter.router();
  }
  // Close modal
  Modal.close();
};

const controllerOpenModal = function (event) {
  if (!event.target.className.split(' ').includes('modal_buton')) return;
  event.preventDefault();
  Modal.open(event.target.name);
  Modal.addHandlerResetForm(controllerResetForm);
};

const controllerSettingsChangeEvents = async function (target) {
  // console.log(target.name);
  switch (target.name) {
    case 'ip_type':
      // Handler to enable or disable network inputs based on IP type
      controllerIpType(target);
      break;
    case 'laser':
      // Handler to update Laser State
      await controllerLaserState(target);
      break;
    default:
      // Handler to check IP Address input format
      controllerInputFormat(target);
      break;
  }
};

const init = function () {
  for (const evt of ['hashchange', 'load']) {
    window.addEventListener(evt, myRouter.router);
  }
  Settings.addHandlerUploadData(controllerUploadData);
  Settings.addHandlerChangeEvents(controllerSettingsChangeEvents);
  Settings.addHandlerOpenModal(controllerOpenModal);
};

init();
