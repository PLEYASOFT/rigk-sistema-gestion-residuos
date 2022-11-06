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
const sendCodeDao_1 = __importDefault(require("../dao/sendCodeDao"));
class SendCodeLogic {
    sendCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const output = yield sendCodeDao_1.default.sendCode(req.body.user);
                res.send(output);
            }
            catch (err) {
                console.log(err);
                res.send({ status: 0, message: "Ocurrió un error" });
            }
        });
    }
}
const sendCodeLogic = new SendCodeLogic();
exports.default = sendCodeLogic;
