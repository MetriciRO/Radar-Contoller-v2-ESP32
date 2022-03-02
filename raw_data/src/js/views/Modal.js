import View from './View';

class Modal extends View {
  _parentElement = document.getElementById('modal_wrapper');
  _render_location = 'beforeend';

  open(data) {
    this._state = data;
    const markup = this._generateHTML();
    this._parentElement.insertAdjacentHTML(this._render_location, markup);
  }

  close() {
    this._clear();
  }

  addHandlerResetForm(handler) {
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
    <!-- Overlay / Backdrop used for modal -->
    <div class="overlay close-modal">
    </div>

    <!-- Soft Reset Modal -->
    <div class="modal" id="modal">
        <button class="close-modal-btn close-modal" type="button" name="close_modal">&times;</button>
        <label for="" class="modal-label">Are you sure ?</label>
        <form class="modal-buttons" name="reset_form" id="reset_form">
            <button class="btn btn-primary close-modal" type="button" name="back_button" id="back_button"
                style="min-width: 120px;">Back</button>
            <button class="btn btn-danger reset_btn" type="submit" name="reset_btn" id="reset_btn"
                style="min-width: 120px;">${this._state}</button>
        </form>
    </div>
      `;
  }
}

export default new Modal();
