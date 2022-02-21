import { async } from 'regenerator-runtime';
import { AJAX } from './helpers.js';
import { API_URL } from './config.js';

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

export const getNetworkSettings = async function () {
  try {
    const data = await AJAX(`${API_URL}`);
    state.network_settings = createNetworkObject(data);
    console.log(state.network_settings);
  } catch (error) {
    throw error;
  }
};
export const getRadarSettings = async function () {
  try {
  } catch (error) {}
};
export const getLaserState = async function () {
  try {
  } catch (error) {}
};
export const getUser = async function () {
  try {
  } catch (error) {}
};
