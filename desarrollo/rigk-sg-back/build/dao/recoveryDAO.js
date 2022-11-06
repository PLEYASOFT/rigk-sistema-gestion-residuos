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
const db_1 = __importDefault(require("../db"));
class RecoveryDao {
    recovery(USER) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = db_1.default.getConnection();
            const res = yield conn.query("SELECT * FROM USER WHERE USER = ?", USER).then((res) => res[0]).catch(error => { undefined; });
            let recovery = false;
            if (res != null && res != undefined) {
                recovery = true;
            }
            else {
                console.log("Correo no es  correcto, intente nuevamente");
            }
            conn.end();
            return recovery;
        });
    }
}
const recoveryDao = new RecoveryDao();
exports.default = recoveryDao;
