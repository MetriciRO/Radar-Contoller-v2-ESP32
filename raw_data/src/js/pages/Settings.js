import View from '../views/View.js';

class Settings extends View {
  _parentElement = document.getElementById('content_wrapper');
  _render_location = 'afterbegin';

  _generateHTML() {
    return `
      <!-- First Row Wrapper -->
      <div class="row p-0 m-0">
          <!-- Network Settings -->
          <div class="container network_wrapper col-md-12 col-lg p-2">
              <div class="card bg-dark text-white">
                  <div class="card-header bg-dark border-secondary">
                      <h5 class="card-title">Network Settings</h5>
                  </div>
                  <div class="card-body mb-0">
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">Connected: </label>
                          <label class="col-form-label col-auto text-nowrap" id="connected"></label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">Connection Type: </label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.connection}</label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">IP Type: </label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.ip_type}</label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">IP
                              Address:</label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.ip_address}</label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">Gateway:</label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.gateway}</label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">Subnet
                              Mask:</label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.subnet}</label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">DNS:</label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.dns}</label>
                      </div>
                      <!-- Input row -->
                      <div class="row mb-2 g-0 d-flex justify-content-between">
                          <label class="col-form-label col-4 text-nowrap">MAC
                              Address Eth:</label>
                          <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.mac_address_eth}</label>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `;
  }
}

export default new Settings();
