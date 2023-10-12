import View from '../views/View.js';

class Settings extends View {
  _parentElement = document.getElementById('content_container');
  _render_location = 'afterbegin';

  addHandlerSubmitEvents(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      handler(e);
    });
  }

  addHandlerChangeEvents(handler) {
    this._parentElement.addEventListener('change', function (e) {
      e.preventDefault();
      handler(e.target);
    });
  }

  addHandlerOpenModal(handler) {
    this._parentElement.addEventListener('click', function (e) {
      handler(e);
    });
  }

  _generateHTML() {
    const ip_type = this._state.network_settings.ip_type;
    const laser_state = this._state.radar_settings.laser_state;
    return `
    <!-- First Row Wrapper -->
    <div class="row p-0 m-0">
        <!-- Network Settings -->
        <div class="container network_wrapper col-md-12 col-lg p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title text-white">Network Settings</h5>
                </div>
                <!-- Form -->
                <!-- Can't use Bootstrap Modal inside <form> -->
                <form class="card-body mb-0" id="network_settings" name="network_settings">
                    <!-- Conenction Type - Row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap">Connection Type: </label>
                        <label class="col-form-label col-auto text-nowrap">
                        ${this._state.network_settings.connection}</label>
                    </div>
                    <!-- Radio Buttons IP Type -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label class="col-form-label col-4 text-nowrap" for="dhcp">IP Type: </label>
                        <div class="btn-group col" style="min-width: 207px; max-width: 207px;"
                            id="check_ip_type">
                            <input type="radio" class="btn-check" name="ip_type" id="dhcp"
                                autocomplete="off" value="DHCP"
                                ${ip_type === "DHCP" ? "checked" : ""}>
                            <label class="btn btn-outline-danger shadow-none text-white"
                                for="dhcp">DHCP</label>

                            <input type="radio" class="btn-check" name="ip_type" id="static"
                                autocomplete="off" value="Static" 
                                ${ip_type === "Static" ? "checked" : ""}>
                            <label class="btn btn-outline-danger shadow-none text-white"
                                for="static">Static</label>
                        </div>
                    </div>

                    <!-- IP Address - Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label for="ip_address" class="col-form-label col-4 text-nowrap">IP
                            Address:</label>
                        <div class="col-auto">
                            <input type="text" class="IP-Address ip static form-control" name="ip_address"
                                id="ip_address"
                placeholder="${ip_type === "DHCP" ? "DHCP IP" : "IP-Address"}"
                                ${ip_type === "DHCP" ? "disabled" : ""}>
                        </div>
                    </div>
                    <!-- Gateway - Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label for="gateway" class="col-form-label col-4 text-nowrap">Gateway:</label>
                        <div class="col-auto">
                            <input type="text" class="Gateway ip static form-control" name="gateway" id="gateway"                                
                placeholder="${ip_type === "DHCP" ? "DHCP IP" : "Gateway"}"
                                ${ip_type === "DHCP" ? "disabled" : ""}>
                        </div>
                    </div>
                    <!-- Subnet Mask - Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label for="subnet" class="col-form-label col-4 text-nowrap">Subnet
                            Mask:</label>
                        <div class="col-auto">
                            <input class="Subnet-Mask ip static form-control" list="subnet_options" name="subnet"
                                id="subnet"
                placeholder="${ip_type === "DHCP" ? "DHCP IP" : "Subnet-Mask"}"
                                ${ip_type === "DHCP" ? "disabled" : ""}>
                        </div>
                        <datalist id="subnet_options">
                            <option value="255.255.255.0">
                            <option value="255.255.0.0">
                        </datalist>
                    </div>
                    <!-- DNS - Input row -->
                    <!-- Last element has mb-3 to gain some space before the save button -->
                    <div class="row mb-3 g-0 d-flex justify-content-between">
                        <label for="dns" class="col-form-label col-4 text-nowrap">DNS:</label>
                        <div class="col-auto">
                            <input class="DNS ip static form-control" list="dns_options" name="dns" id="dns"
                placeholder="${ip_type === "DHCP" ? "DHCP IP" : "DNS"}"
                                ${ip_type === "DHCP" ? "disabled" : ""}>
                        </div>
                        <datalist id="dns_options">
                            <option value="8.8.8.8">
                            <option value="1.1.1.1">
                        </datalist>
                    </div>
                    <!-- Submit Button -->
                    <button class="btn btn-danger" type="submit" name="save_network">Save</button>
                </form>
            </div>
        </div>

        <!-- Radar Settings -->
        <div class="container input_wrapper col-md p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title text-white">Radar Settings</h5>
                    <ul class="nav nav-tabs card-header-tabs" data-bs-tabs="tabs">
                        <li class="nav-item">
                            <a class="nav-link active text-white" aria-current="true" data-bs-toggle="tab"
                                href="#radar_settings">Radar</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" data-bs-toggle="tab" href="#laser">Laser</a>

                        </li>
                    </ul>
                </div>
                <div class="card-body tab-content mb-0">
                    <!-- Input form tab -->
                    <form class="tab-pane active" id="radar_settings" name="radar_settings">
                        <!-- Server Address - Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between">
                            <label for="server_address" class="col-form-label col-4 text-nowrap">Server
                                Address:</label>
                            <div class="col-auto">
                                <input type="url" class="Server-Address url form-control" name="server_address"
                                    id="server_address" placeholder="Server-Address">
                            </div>
                        </div>
                        <!-- Server Port - Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between">
                            <label for="server_port" class="col-form-label col-4 text-nowrap">Server
                                Port:</label>
                            <div class="col-auto">
                                <input type="text" class="Server-Port number form-control" name="server_port" id="server_port"
                                    placeholder="Port">
                            </div>
                        </div>
                        <!-- Detection Direction - Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between">
                            <label for="detection_direction"
                                class="col-form-label col-4 text-nowrap">Detection Direction:</label>
                            <div class="col-auto">
                                <input class="Detection-Direction list form-control" list="detection_direction_options"
                                    name="detection_direction" id="detection_direction"
                                    placeholder="Detection Direction">
                            </div>
                            <datalist id="detection_direction_options">
                                <option value="Towards">
                                <option value="Away">
                                <option value="Bidirectional">
                            </datalist>
                        </div>
                        <!-- Detection Threshold - Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between">
                            <label for="detection_threshold"
                                class="col-form-label col-4 text-nowrap">Detection Threshold:</label>
                            <div class="col-auto">
                                <input type="text" class="Detection-Threshold number form-control" name="detection_threshold"
                                    id="detection_threshold" placeholder="Detection Threshold">
                            </div>
                        </div>
                        <!-- Speed Units - Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between">
                            <label for="speed_units" class="col-form-label col-4 text-nowrap">Speed
                                Units:</label>
                            <div class="col-auto">
                                <input class="Speed-Units list form-control" list="speed_units_options" name="speed_units"
                                    id="speed_units" placeholder="Speed Units">
                            </div>
                            <datalist id="speed_units_options">
                                <option value="KPH">
                                <option value="MPH">
                            </datalist>
                        </div>
                        <!-- Trigger Speed - Input row -->
                        <!-- Last element has mb-3 to gain some space before the save button -->
                        <div class="row mb-3 g-0 d-flex justify-content-between">
                            <label for="trigger_speed" class="col-form-label col-4 text-nowrap">Trigger
                                Speed:</label>
                            <div class="col-auto">
                                <input type="text" class="Trigger-Speed number form-control" name="trigger_speed"
                                    id="trigger_speed" placeholder="Trigger Speed">
                            </div>
                        </div>
                        <!-- Submit Button -->
                        <button class="btn btn-danger" type="submit" name="save_network">Save</button>
                    </form>
                    <!-- Laser form tab -->
                    <form class="tab-pane" id="laser" name="laser">
                        <!-- Laser State - Radio Button Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between">
                            <label class="col-form-label col-4 text-nowrap" for="laser_state">Laser: </label>
                            <div class="btn-group col" style="min-width: 207px; max-width: 207px;"
                                id="laser_state">
                                <input type="radio" class="btn-check" name="laser" id="laser_on"
                                    autocomplete="off" value="On"
                                    ${laser_state === "On" ? "checked" : ""}>
                                <label class="btn btn-outline-danger shadow-none text-white"
                                    for="laser_on">On</label>

                                <input type="radio" class="btn-check" name="laser" id="laser_off"
                                    autocomplete="off" value="Off" 
                                    ${laser_state === "Off" ? "checked" : ""}>
                                <label class="btn btn-outline-danger shadow-none text-white"
                                    for="laser_off">Off</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Second Row Wrapper -->
    <div class="row p-0 m-0">
        <!-- Backup/Restore -->
        <div class="container input_wrapper col-md-12 col-lg p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title text-white">Backup/Restore Settings</h5>
                    <ul class="nav nav-tabs card-header-tabs" data-bs-tabs="tabs">
                        <li class="nav-item">
                            <a class="nav-link active text-white" aria-current="true" data-bs-toggle="tab"
                                href="#backup">Backup/Restore</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-white" data-bs-toggle="tab" href="#reset-tab">Factory
                                Reset</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body tab-content mb-0" style="min-height: 232px">
                    <!-- Backup/Restore tab -->
                    <div class="tab-pane active" id="backup">
                        <!-- Input row -->
                        <form action="/api/backup" method="get" class="row mb-2 g-0 d-flex justify-content-between"
                            id="backup_form" name="backup_form">
                            <label class="col-form-label col-12 text-nowrap">Backup current
                                configuration to file:</label>
                            <div class="col-auto">
                                <button class="btn btn-danger" type="submit" name="backup_btn"
                                    id="backup_btn">Save to file</button>
                            </div>
                        </form>
                        <!-- Input row -->
                        <label for="restore_file" class="form-label">Restore configuration from
                            file:</label>
                        <form class="row g-2 d-flex justify-content-between" method="POST"
                            enctype="multipart/form-data" name="restore_form" id="restore_form">
                            <div class="col-12 col-sm-auto">
                                <input class="form-control form-control-small" type="file"
                                    name="restore_file" id="restore_file" required>
                            </div>
                            <button class="btn btn-danger col-auto ms-1" name="restore_btn" id="restore_btn"
                                type="submit">Upload</button>
                        </form>
                    </div>
                    <!-- Factory Reset Tab -->
                    <div class="tab-pane" id="reset-tab" name="reset-tab">
                        <!-- Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between" id="soft_reset_container"
                            name="soft_reset_container">
                            <label for="" class="col-form-label col-12 ">Reset settings but
                                keep Network Configuration:</label>
                            <div class="col-auto">
                                <button class="btn btn-danger modal_buton" type="button" name="Soft Reset"
                                    id="soft_reset" data-reset='Soft'
                                    style="min-width: 120px;">Soft Reset</button>
                            </div>
                        </div>
                        <!-- Input row -->
                        <div class="row mb-2 g-0 d-flex justify-content-between"
                            class="factory_reset_container" name="factory_reset_container">
                            <label for="" class="col-form-label col-12 text-nowrap">Reset
                                all settings:</label>
                            <div class="col-auto">
                                <button class="btn btn-danger modal_buton" type="button" name="Factory Reset"
                                    id="factory_reset" data-reset='Factory' style="min-width: 120px;">Factory
                                    Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Update -->
        <div class="container rfid_wrapper col-md p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title text-white">Update Firmware</h5>
                </div>
                <p class="px-3 py-2 mb-1">
                    Please upload the provided <span style="color:#e11422">firmware.bin</span> file and/or
                    <span style="color:#e11422">littlefs.bin</span> file one at a time.
                </p>
                <div class="px-3">
                    Notes:</br>
                    (1): After the update has ended you will be redirected to another page.</br>
                    (2): Don't worry about your settings. The current configuration will be kept after the
                    update.</br>
                    (3): The device will restart after each file upload.</br>
                </div>
                <!-- Form -->
                <form class="card-body mb-0" id="update_form" name="update_form" method="POST"
                    enctype="multipart/form-data">
                    <!-- Input row -->
                    <div class="row g-2 d-flex justify-content-between">
                        <div class="col-12 col-sm-auto">
                            <input class="form-control form-control-small" type="file" id="update_file"
                                name="update" required>
                        </div>
                        <button class="btn btn-danger col-auto ms-1" type="submit" name="update_btn"
                            id="update_btn">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
      `;
  }
}

export default new Settings();
