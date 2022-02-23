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

export const getDataPeriodically = function (s) {
  let interval = setInterval(() => {
    getLiveState().catch((error) => console.log(error));
  }, s * 1000);
  return interval;
};
