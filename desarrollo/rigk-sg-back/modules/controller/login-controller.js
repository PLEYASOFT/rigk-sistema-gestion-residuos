const express = require("express");
const cors = require("cors");
const login = express.Router();
//const singleton = require("../../resources/foo/singleton");
const loginLogic = require("../logic/login-logic");

class LoginController {
    constructor(app) {
        login.post("/", (req, res) => {
            loginLogic.login(req, res);
        } 
        );
        app.use("/api/v1/login", cors({ origin: "*" }), login, (err, req, res, next) => {
            res.status(500).send({ message: "Error" });
            next(err);
        });
    }
}

module.exports = LoginController;
