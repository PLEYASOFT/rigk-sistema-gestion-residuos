const LoginController = require("./controller/login-controller");

class Module {
    constructor(app) { this.app = app }
    init() {
        new LoginController(this.app);
    }
}

module.exports = Module;
