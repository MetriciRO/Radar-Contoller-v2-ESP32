import Toastify from 'toastify-js';

export default class View {
  _state;

  render(data) {
    // 1. Get live state from server
    this._state = data;
    // 3. Render page
    this._clear();
    // console.log(this._state);
    const markup = this._generateHTML();
    this._parentElement.insertAdjacentHTML(this._render_location, markup);
  }

  update(data) {}

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
