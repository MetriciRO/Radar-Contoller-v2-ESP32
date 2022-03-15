import View from './View';

class Modal extends View {
  _parentElement = document.getElementById('modal_wrapper');
  _render_location = 'beforeend';

  open(data, which_markup) {
    this._state = data;
    let markup;
    switch (which_markup) {
      case 'reset_modal':
        markup = this._generateHTML();
        break;
      case 'after_network_modal':
        markup = this._generateAfterNetworkHTML();
        break;
      case 'after_reset_modal':
        markup = this._generateAfterResetHTML();
        break;
      case 'after_upload_file_modal':
        markup = this._generateAfterUploadingFileHTML();
        break;

      default:
        break;
    }
    this._parentElement.insertAdjacentHTML(this._render_location, markup);
  }

  close() {
    this._clear();
  }

  addHandlerForClick(handler) {
    const modal_container = document.getElementById('modal');

    for (const event of ['click']) {
      modal_container.addEventListener(event, function (e) {
        e.preventDefault();
        handler(e.target);
      });
    }
  }

  _generateHTML() {
    return `
    <div id="modal">
      <!-- Backdrop used for modal -->
      <div class="modal-backdrop close-modal">
      </div>

      <!-- Soft Reset Modal -->
      <div class="modal">
          <button class="close-modal-btn close-modal" type="button" name="close_modal">&times;</button>
          <label for="" class="modal-label">Are you sure ?</label>
          <form class="modal-buttons" name="reset_form" id="reset_form">
              <button class="btn btn-primary close-modal" type="button" name="back_button" id="back_button"
                  style="min-width: 120px;">Back</button>
              <button class="btn btn-danger reset_btn" type="submit" name="reset_btn" id="reset_btn"
                  style="min-width: 120px;">${this._state}</button>
          </form>
      </div>
    </div>
      `;
  }
  _generateAfterNetworkHTML() {
    const ip_type = this._state.network_settings.ip_type;
    const ip_address = this._state.network_settings.ip_address;
    return `    
    <!-- Backdrop used for modal -->
    <div class="modal-backdrop close-modal">
    </div>

    <!-- After Network Submit Modal -->
    <div class="modal">
      <span>You are no longer connected to this interface.</span>
      ${
        ip_type === 'DHCP'
          ? `<span>Please search for the device address in the DHCP list.</span>`
          : `<span>Please navigate to http://${ip_address}.<br>(Click on this link after 10 seconds)</span>`
      }    
    </div>
      `;
  }
  _generateAfterResetHTML() {
    const default_ip = '192.168.0.100';
    return `    
    <!-- Backdrop used for modal -->
    <div class="modal-backdrop close-modal">
    </div>

    <!-- After Reset Modal -->
    <div class="modal">
      <span>You are no longer connected to this interface.</span> 
      <span>Please navigate to <a href="http://${default_ip}">http://${default_ip}</a>.
      <br>(Click on this link after 10 seconds)</span>
    </div>
      `;
  }
  _generateAfterUploadingFileHTML() {
    return `    
    <!-- Backdrop used for modal -->
    <div class="modal-backdrop close-modal">
    </div>

    <!-- After Update Modal -->
    <div class="modal">
      <span>Please wait until the file has been uploaded.</span>
    </div>
      `;
  }
}

export default new Modal();
