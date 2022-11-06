"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
// const loginDao = require('../dao/login-dao');
const loginDao_1 = __importDefault(require("../dao/loginDao"));
const jwt_1 = require("../helpers/jwt");
class LoginLogic {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.user;
            const password = req.body.password;
            let passworHash = bcrypt_1.default.hashSync(password, 8);
            try {
                const output = yield loginDao_1.default.login(user);
                bcrypt_1.default.compare(password, output.PASSWORD).then((r) => __awaiter(this, void 0, void 0, function* () {
                    if (r) {
                        const token = yield (0, jwt_1.generarJWT)(user, `${output.FIRST_NAME} ${output.LAST_NAME}`, "");
                        res.json(token);
                    }
                    else {
                        res.send('No Pasó :(');
                    }
                }));
            }
            catch (err) {
                console.log(err);
                res.send({ status: 0, message: "Ocurrió un error" });
            }
        });
    }
    test(req, res) {
        const { id } = req.params;
        res.json({ status: true });
    }
}
const loginLogic = new LoginLogic();
exports.default = loginLogic;
