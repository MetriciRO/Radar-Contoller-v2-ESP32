import { async } from 'regenerator-runtime';
import { AJAX, toast } from './utils/helpers.js';
import * as config from './utils/config.js';

export const state = {
  network_settings: {},
  radar_settings: {},
  laser: { state: 'Off' },
  user: {},
  logs: '',
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
  } catch (error) {
    throw error;
  }
};

export const postData = async function (data, target) {
  // console.log(target);
  try {
    switch (target) {
      case 'network_settings':
        // Update state object
        state.network_settings = createObject(data, 'network_settings');
        // console.log(state.network_settings);
        // Upload state object
        await AJAX(config.API_POST_NETWORK, state.network_settings);
        toast('Network settings were saved.', false);
        toast('You are no longer connected to the device', true);
        if (state.network_settings.ip_type === 'DHCP')
          toast(
            'Please search for the device address in the DHCP list.',
            false
          );
        if (state.network_settings.ip_type === 'Static')
          toast(
            `Please navigate to ${state.network_settings.ip_address} . (Click on this after 10 seconds)`,
            false,
            `http://${state.network_settings.ip_address}`
          );
        break;
      case 'radar_settings':
        state.radar_settings = createObject(data, 'radar_settings');
        // console.log(state.radar_settings);
        await AJAX(config.API_POST_RADAR, state.radar_settings);
        toast('Radar settings were saved.', false);
        break;
      case 'user_form':
        state.user = createObject(data, 'user');
        // console.log(state.user);
        await AJAX(config.API_POST_USER, state.user);
        toast('User data was saved.', false);
        toast('Please wait until the page has finished refreshing.', false);
        setTimeout(() => location.reload(), 3000);
        break;
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
};

export const getAction = async function (target) {
  try {
    switch (target.id) {
      case 'laser_on':
        state.radar_settings.laser_state = 'On';
        await AJAX(config.API_LASER_ON);
        toast('Laser is ON', false);
        break;
      case 'laser_off':
        state.radar_settings.laser_state = 'Off';
        await AJAX(config.API_LASER_OFF);
        toast('Laser is OFF', false);
        break;
      case 'backup_form':
        break;
      case 'reset_btn':
        switch (target.innerText) {
          case 'Soft Reset':
            await AJAX(config.API_GET_SOFT_RESET);
            toast('Soft reset was successful.', false);
            toast('The device will restart shortly.', false);
            break;
          case 'Factory Reset':
            await AJAX(config.API_GET_FACTORY_RESET);
            toast('Factory reset was successful.', false);
            toast('The device will restart shortly.', false);
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

export const getLogs = async function () {
  try {
    const logs = await AJAX(config.API_GET_LOGS);
    state.logs = logs;
  } catch (error) {
    throw error;
  }
};
