import { async } from 'regenerator-runtime';
import { AJAX } from './utils/helpers.js';
import { API_URL } from './utils/config.js';

export const state = {
  network_settings: {},
  radar_settings: {},
  user: {},
};

const createNetworkObject = function (data) {
  const { network_settings } = data;
  return network_settings;
};
const createRadarObject = function (data) {
  const { radar_settings } = data;
  return radar_settings;
};
const createUserSetting = function (data) {
  const { user } = data;
  return user;
};

export const getLiveState = async function () {
  try {
    const data = await AJAX(`${API_URL}`);
    state.network_settings = createNetworkObject(data);
    state.radar_settings = createRadarObject(data);
    state.user = createUserSetting(data);

    console.log(state);
  } catch (error) {
    throw error;
  }
};
