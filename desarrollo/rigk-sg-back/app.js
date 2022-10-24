const express = require("express");
const app = express();
const init =  () => {
    const Approuting = require("./modules");
    const appmodules = new Approuting(app);
    appmodules.init();
};
init();
module.exports = app;