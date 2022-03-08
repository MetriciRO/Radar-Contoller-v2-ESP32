import View from '../views/View.js';
import Logs from '../views/Logs.js';

class Dashboard extends View {
  _parentElement = document.getElementById('content_container');
  _render_location = 'afterbegin';

  addHandlerUpdate(handler) {}

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
                    <!-- Connected - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Connected: </label>
                        <label class="col-form-label col-auto text-nowrap" id="connected"></label>
                    </div>
                    <!-- Conenction Type - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Connection Type: </label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.connection}</label>
                    </div>
                    <!-- IP Type - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">IP Type: </label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.ip_type}</label>
                    </div>
                    <!-- IP Address - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">IP
                            Address:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.ip_address}</label>
                    </div>
                    <!-- Gateway - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Gateway:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.gateway}</label>
                    </div>
                    <!-- Subnet Mask - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Subnet
                            Mask:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.subnet}</label>
                    </div>
                    <!-- DNS - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">DNS:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.dns}</label>
                    </div>
                    <!-- MAC Address - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">MAC
                            Address Eth:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.network_settings.mac_address_eth}</label>
                    </div>
                </div>
            </div>
        </div>
        <!-- Radar Settings -->
        <div class="container radar_wrapper col-md-12 col-lg p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title">Radar Settings</h5>
                </div>
                <div class="card-body mb-0">
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Server IP:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.server_address}</label>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Server Port:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.server_port}</label>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Detection Direction:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.detection_direction}</label>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Detection Threshold:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.detection_threshold}</label>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Speed Units:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.speed_units}</label>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Trigger Speed:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.trigger_speed}</label>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Laser:</label>
                        <label class="col-form-label col-auto text-nowrap">${this._state.radar_settings.laser_state}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Logs -->
    <div class="row p-0 m-0" id="logs_wrapper"></div>
    `;
  }
}

export default new Dashboard();
