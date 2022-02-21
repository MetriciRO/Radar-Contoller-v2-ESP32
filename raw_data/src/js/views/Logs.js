import View from './View';

class Logs extends View {
  _parentElement = document.getElementById('content_wrapper');
  _render_location = 'beforeend';

  _generateHTML() {
    return `
      <div class="row p-0 m-0">
          <!-- Logs -->
          <div class="container logs_wrapper col-md p-2">
              <div class="card bg-dark text-white">
                  <div class="card-header bg-dark border-secondary">
                      <h5 class="card-title text-white">Logs</h5>
                  </div>
                  <div class="card-body mb-0" id="logs">
                  </div>
              </div>
          </div>
      </div>
      `;
  }
}

export default new Logs();
