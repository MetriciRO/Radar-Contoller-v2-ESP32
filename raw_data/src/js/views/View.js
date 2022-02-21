export default class View {
  _state;

  render(data = undefined) {
    if (data) {
      this._state = data;
      this._clear();
    }
    console.log(this._state);
    const markup = this._generateHTML();
    this._parentElement.insertAdjacentHTML(this._render_location, markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
