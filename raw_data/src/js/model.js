import { async } from 'regenerator-runtime';
import { AJAX } from './utils/helpers.js';
import { API_URL } from './utils/config.js';

export const state = {
  network_settings: {},
  radar_settings: {},
  user: {},
  logs: 'Test Logs',
};

const createObject = function (data, object_key) {
  const settings = data[object_key];
  return settings;
};

export const getLiveState = async function () {
  try {
    const data = await AJAX(`${API_URL}`);
    state.network_settings = createObject(data, 'network_settings');
    state.radar_settings = createObject(data, 'radar_settings');
    state.user = createObject(data, 'user');
    // state.logs = createObject(data, 'logs');

    console.log('model.state:', state);
  } catch (error) {
    throw error;
  }
};

export const uploadData = async function (data, object_key) {
  // console.log(object_key);
  // Update model.state
  switch (object_key) {
    case 'network_settings':
      state.network_settings = createObject(data, 'network_settings');
      break;
    case 'radar_settings':
      state.radar_settings = createObject(data, 'radar_settings');
      break;
    case 'laser':
      break;
    case 'backup_form':
    case 'restore_form':
    case 'update_form':
      break;
    case 'user':
      state.user = createObject(data, 'user');
      break;
    default:
      break;
  }
  // Upload data to server
  console.log(state);
};

export const getDataPeriodically = function (s) {
  let interval = setInterval(() => {
    getLiveState().catch((error) => console.log(error));
  }, s * 1000);
  return interval;
};
