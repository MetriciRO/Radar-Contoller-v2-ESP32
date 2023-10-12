import logo from 'url:../../icons/logo.png';
import View from './View';

class Navbar extends View {
  _parentElement = document.getElementById('nav_wrapper');
  _render_location = 'afterbegin';
  _location;

  async render(location) {
    this._location = location;
    // 3. Render page
    this._clear();
    // console.log(this._state);
    const markup = this._generateHTML(location);
    this._parentElement.insertAdjacentHTML(this._render_location, markup);
  }

  _generateHTML() {
    let dashboard = `nav-link text-white`;
    let settings = `nav-link text-white`;
    let user = `nav-link text-white`;

    let location = this._location ?? undefined;

    if (location) {
      switch (location) {
        case '/':
          dashboard = `nav-link text-white active aria-current="dashboard"`;
          break;
        case '/settings':
          settings = `nav-link text-white active aria-current="dashboard"`;
          break;
        case '/user':
          user = `nav-link text-white active aria-current="dashboard"`;
          break;

        default:
          break;
      }
    }

    return `
        <!-- Nav -->        
        <div class="d-flex flex-row flex-md-column justify-content-center flex-wrap text-white h-100
        overflow-hidden">
            <a href="https://www.metrici.ro/" id="logo-link"
                class="d-none d-md-flex align-items-center text-white text-decoration-none me-1">
                <img src="${logo}" alt="logo" class="me-1 m-sm-1" id="logo">
            </a>
            <hr class="d-none d-md-block">
            <ul
                class="nav nav-pills flex-row flex-md-column flex-nowrap align-items-center align-items-md-stretch mb-md-auto">
                <li class="nav-item">
                    <a href="#" class="${dashboard}">
                        Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#settings" class="${settings}">
                        Settings
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#user" class="${user}">
                        User
                    </a>
                </li>
            </ul>
            <hr class="d-none d-md-block">
            <div class="d-none d-md-flex flex-column text-nowrap justify-content-center align-items-center">
                <a href="https://www.metrici.ro/" id="copyright">Metrici © 2023</a>
                <p>All Rights Reserved.</p>
            </div>
        </div>
        `;
  }
}

export default new Navbar();
