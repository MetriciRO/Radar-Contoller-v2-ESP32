import { AJAX } from '../utils/helpers.js';
import { API_URL } from '../utils/config.js';

export default class View {
  _state;
  _url = API_URL;

  async _getData(url) {
    return await AJAX(url);
  }

  async render() {
    // 1. Get live state from server
    const data = await this._getData(this._url);
    this._state = data;
    // 2. Update model state
    // 3. Render page
    this._clear();
    // console.log(this._state);
    const markup = this._generateHTML();
    this._parentElement.insertAdjacentHTML(this._render_location, markup);
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
