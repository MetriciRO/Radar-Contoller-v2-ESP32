import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import {
  checkInputFormat,
  checkUserDataFormat,
  AJAX,
} from './utils/helpers.js';
import { IP_FORMAT, NUMBER_FORMAT, URL_FORMAT } from './utils/config.js';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import User from './pages/User';

import Navbar from './views/Navbar';
import Logs from './views/Logs';
import Modal from './views/Modal.js';
import { async } from 'regenerator-runtime';

class Router {
  _routes = {
    '/': Dashboard,
    '/settings': Settings,
    '/user': User,
  };

  router = async () => {
    try {
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
    } catch (error) {
      throw error;
    }
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
  // Check IP Inputs format
  if (input.className.split(' ').includes('ip'))
    return checkInputFormat(input, IP_FORMAT);
  // Check Number Inputs format
  else if (input.className.split(' ').includes('number'))
    return checkInputFormat(input, NUMBER_FORMAT);
  // Check URL Inputs format
  else if (input.className.split(' ').includes('url'))
    return checkInputFormat(input, URL_FORMAT);
  // Check List Inputs format
  else if (input.className.split(' ').includes('list'))
    return checkInputFormat(input);
  // Check User Inputs format
  else if (input.className.split(' ').includes('user'))
    return checkUserDataFormat(input);
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
  for (const element of form.elements) {
    if (element.placeholder === 'DHCP IP') continue;
    if (!controllerInputFormat(element)) return false;
  }
  return true;
};

const controllerUploadData = async function (form) {
  if (form.name === 'user') return;
  // 1. Validate form
  if (!validateForm(form)) {
    console.log('Did not validate data');
    return;
  }
  // 2. Get data from form
  const new_data = {
    [form.id]: Object.fromEntries(new FormData(form)),
  };

  // 2.5 Open modal with data
  // Modal.render(new_data);
  try {
    // 3. Upload new data to server
    await model.postData(new_data, form.id);
    form.reset();
    // 4. Update Views
    await myRouter.router();
  } catch (error) {
    console.error(error);
  }
};

// Enable or disable network inputs based on Connection Type
const checkIpTypeChange = function (target) {
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
    try {
      // Send reset request to server
      await model.getAction(target);
      // Re-render after reset
      await myRouter.router();
    } catch (error) {
      console.error(error);
    }
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

const controllerUploadFile = function (event) {
  const form = event.target;
  for (const element of form.elements) {
    if (element.type === 'file') {
      const filename = element.files[0].name;
      switch (element.id) {
        case 'restore_file':
          switch (filename) {
            case 'config.json':
              console.log('File is valid.');
              console.log('Changing configuration. Please wait !');
              // Toast
              break;
            default:
              console.log('File is not valid !');
              // Toast
              event.preventDefault();
              break;
          }
          break;
        case 'update_file':
          switch (filename) {
            case 'spiffs.bin':
            case 'firmware.bin':
              console.log('Update file is valid. Update will proceed');
              // toast(`File ${filename} was successfully uploaded !`, true);
              // toast(`The update process has started...`, true);
              // updatingToast('Updating...', true);
              break;
            default:
              // toast('File was not uploaded. Try again !', false);
              console.log('Update file is not valid. Update is not possible !');
              event.preventDefault();
              break;
          }
          break;
        default:
          break;
      }
    }
  }
};

// Handle all submit events on the Settings page
const controllerSettingsSubmitEvents = async function (event) {
  // console.log(event.target.name);
  switch (event.target.name) {
    case 'network_settings':
    case 'radar_settings':
      event.preventDefault();
      controllerUploadData(event.target);
      break;
    case 'restore_form':
    case 'update_form':
      controllerUploadFile(event);
      break;
    case 'backup_form':
      break;
    default:
      break;
  }
};

// Handle all change events on the Settings Page
const controllerSettingsChangeEvents = async function (target) {
  // console.log(target.name);
  switch (target.name) {
    case 'ip_type':
      // Handler to enable or disable network inputs based on IP type
      checkIpTypeChange(target);
      break;
    case 'laser':
      try {
        // Handler to update Laser State
        await model.getAction(target);
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      // Handler to check every Input format
      controllerInputFormat(target);
      break;
  }
};

// Handle User data upload
const controllerUploadUserData = async function (form) {
  if (form.name !== 'user') return;
  // 1. Validate form
  if (!validateForm(form)) {
    console.log('Data could not be validated !');
    return;
  }
  // 2. Get data from form
  const new_data = {
    [form.name]: Object.fromEntries(new FormData(form)),
  };
  // 2.5 Open modal with data
  // Modal.render(new_data);
  try {
    // 3. Upload new data to server
    await model.postData(new_data, form.id);
    form.reset();
    // 4. Update Views
    await myRouter.router();
  } catch (error) {
    console.error(error);
  }
};

const init = function () {
  for (const evt of ['hashchange', 'load']) {
    window.addEventListener(evt, myRouter.router);
  }
  Settings.addHandlerSubmitEvents(controllerSettingsSubmitEvents);
  Settings.addHandlerChangeEvents(controllerSettingsChangeEvents);
  Settings.addHandlerOpenModal(controllerOpenModal);
  User.addHandlerUploadUserData(controllerUploadUserData);
};

init();
