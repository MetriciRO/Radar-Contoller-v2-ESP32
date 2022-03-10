export const TIMEOUT_SEC = 5;

export const API_POST_NETWORK = '/api/network/post';
export const API_POST_RADAR = '/api/radar/post';
export const API_POST_USER = '/api/user/post';

export const API_GET_SOFT_RESET = '/api/soft-reset';
export const API_GET_FACTORY_RESET = '/api/factory-reset';
export const API_GET_BACKUP = '/api/backup';
export const API_GET_LOGS = '/api/logs';

export const API_LASER_ON = '/laser/on';
export const API_LASER_OFF = '/laser/off';

// export const API_GET_SETTINGS =
//   'https://mocki.io/v1/1dfa8bc2-9bea-4464-9e50-9e54f0159284';
export const API_GET_SETTINGS = '/api/settings/get';

export const IP_FORMAT =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const NUMBER_FORMAT = /^(0|[1-9]\d*)(\.\d+)?$/;
export const URL_FORMAT =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
