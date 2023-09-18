import View from "./View";

class Logs extends View {
  _parentElement = document.getElementById("logs_container");
  _render_location = "beforeend";

  addHandlerUpdate(handler) {}

  _generateHTML() {
    return `
    <!-- Third Row Wrapper -->
    <div class="row p-0 m-0" id="logs_wrapper">
        <!-- Logs -->
        <div class="container col-md p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title text-white">Logs</h5>
                </div>
                <div class="card-body mb-0" id="logs">
                ${this._state.logs}
                </div>
            </div>
        </div>
    </div>
      `;
  }
}

export default new Logs();
