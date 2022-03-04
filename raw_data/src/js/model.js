import { async } from 'regenerator-runtime';
import { AJAX } from './utils/helpers.js';
import * as config from './utils/config.js';

export const state = {
  network_settings: {},
  radar_settings: {},
  laser: { state: 'Off' },
  user: {},
  logs: 'Test Logs',
};

const createObject = function (data, object_key) {
  const settings = data[object_key];
  return settings;
};

export const getLiveState = async function () {
  try {
    const data = await AJAX(`${config.API_GET_SETTINGS}`);
    state.network_settings = createObject(data, 'network_settings');
    state.radar_settings = createObject(data, 'radar_settings');
    state.user = createObject(data, 'user');
    // state.logs = createObject(data, 'logs');

    // console.log('model.state:', state);
  } catch (error) {
    throw error;
  }
};

export const postData = async function (data, target) {
  // console.log(target);
  // Update model.state
  try {
    switch (target) {
      case 'network_settings':
        // Update state object
        state.network_settings = createObject(data, 'network_settings');
        console.log(state.network_settings);
        // Upload state object
        await AJAX(config.API_POST_NETWORK, state.network_settings);
        break;
      case 'radar_settings':
        state.radar_settings = createObject(data, 'radar_settings');
        console.log(state.radar_settings);
        await AJAX(config.API_POST_RADAR, state.radar_settings);
        break;
      case 'user_form':
        state.user = createObject(data, 'user');
        console.log(state.user);
        await AJAX(config.API_POST_USER, state.user);
        break;
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  // Upload data to server
  // console.log(state);
};

// export const getDataPeriodically = function (s) {
//   let interval = setInterval(() => {
//     getLiveState().catch((error) => console.log(error));
//   }, s * 1000);
//   return interval;
// };

export const getAction = async function (target) {
  try {
    switch (target.id) {
      case 'laser_on':
        state.radar_settings.laser_state = 'On';
        await AJAX(config.API_LASER_ON);
        break;
      case 'laser_off':
        state.radar_settings.laser_state = 'Off';
        await AJAX(config.API_LASER_OFF);
        break;
      case 'backup_form':
        await AJAX(config.API_GET_BACKUP);
        break;
      case 'reset_btn':
        switch (target.innerText) {
          case 'Soft Reset':
            await AJAX(config.API_GET_SOFT_RESET);
            break;
          case 'Factory Reset':
            await AJAX(config.API_GET_FACTORY_RESET);
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  } catch (error) {
    throw error;
  }
};
