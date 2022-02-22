import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import Router from './router.js';

const init = async function () {
  for (const evt of ['hashchange', 'load']) {
    window.addEventListener(evt, Router.router);
  }
};

init();
