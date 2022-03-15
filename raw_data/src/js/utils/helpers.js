import { TIMEOUT_SEC, IP_FORMAT, NUMBER_FORMAT, URL_FORMAT } from './config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

// show a toast notification
// type: true for info, false for error
export const toast = function (message, is_error, dest = '') {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'bottom', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    offset: {
      y: '3em', // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: is_error ? 'error' : 'info',
    destination: dest,
    // onClick: function () { } // Callback after click
  }).showToast();
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
          redirect: 'follow',
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    let data;
    const content_type = res.headers.get('Content-Type').split(';')[0];
    if (content_type === 'application/json') {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};

const wrong_format = function (input) {
  input.classList.remove('correct');
  input.classList.add('wrong');
  input.focus();
  alert(input.className.split(' ')[0] + ' is invalid!');
  return false;
};

const correct_format = function (input) {
  input.classList.remove('wrong');
  input.classList.add('correct');
  return true;
};

// Checks input value
export const checkInputFormat = function (input, check_format = undefined) {
  // The value won't change
  if (input.value === 'reset' || input.value.length === 0) {
    input.classList.remove('correct');
    input.classList.remove('wrong');
    return true;
  } else if (check_format) {
    if (!input.value.match(check_format)) {
      return wrong_format(input);
    } else return correct_format(input);
  } else if (!check_format) {
    // Treat special cases
    switch (input.id) {
      case 'detection_direction':
        if (!['Towards', 'Away', 'Bidirectional'].includes(input.value))
          return wrong_format(input);
        else return correct_format(input);
      case 'speed_units':
        if (!['KPH', 'MPH'].includes(input.value)) return wrong_format(input);
        else return correct_format(input);
      default:
        break;
    }
  }
};

export const checkUserDataFormat = function (input) {
  switch (input.id) {
    case 'username':
    case 'password':
      if (input.value.length <= 0) return wrong_format(input);
      else return correct_format(input);
    default:
      break;
  }
};
