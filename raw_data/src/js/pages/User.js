import View from '../views/View.js';

class User extends View {
  _parentElement = document.getElementById('content_container');
  _render_location = 'beforeend';

  addHandlerUploadUserData(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      handler(e);
    });
  }

  _generateHTML() {
    return `
    <!-- First Row Wrapper -->
    <div class="row p-0 m-0 user_wrapper">
        <!-- User -->
        <div class="container col-md p-2">
            <div class="card bg-dark text-white">
                <div class="card-header bg-dark border-secondary">
                    <h5 class="card-title text-white">User Settings</h5>
                </div>
                <div class="px-3">
                    Notes:</br>
                    (1): There can only be one User.</br>
                    (2): Saving User Name or Password will replace, if existing, the current one.</br>
                    (3): Saving or changing user settings will restart the device.
                </div>
                <!-- Form -->
                <form class="card-body mb-0" id="user_form" name="user">
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label for="username" class="col-form-label col-4 text-nowrap">Username:</label>
                        <div class="col-auto">
                            <input type="text" class="Username user form-control" name="username" id="username"
                                placeholder="Username" aria-label="Username">
                        </div>
                    </div>
                    <!-- Input row -->
                    <div class="row mb-2 g-0 d-flex justify-content-between">
                        <label for="password" class="col-form-label col-4 text-nowrap">Password:</label>
                        <div class="col-auto">
                            <input type="password" class="Password user form-control" name="password"
                                id="password" placeholder="Password" minlength="8" aria-label="Password">
                        </div>
                    </div>
                    <!-- Submit Button -->
                    <button class="btn btn-danger" type="submit" name="save_user">Save</button>
                </form>
            </div>
        </div>
    </div>
    `;
  }
}

export default new User();
