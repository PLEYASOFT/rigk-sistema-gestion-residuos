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
class statementDeclaretionDao {
    getDeclaretionByYear(business, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = db_1.default.getConnection();
            const res_header = yield (conn === null || conn === void 0 ? void 0 : conn.query("SELECT * FROM header_statement_form WHERE ID_BUSINESS = ? AND YEAR_STATEMENT = ?", [business, year]).then((res) => res[0]).catch(error => { undefined; }));
            const id_statement = res_header[0].ID;
            const res_detail = yield (conn === null || conn === void 0 ? void 0 : conn.query("SELECT * FROM detail_statement_form WHERE ID_HEADER = ?", [id_statement]).then((res) => res[0]).catch(error => { undefined; }));
            return { header: res_header[0], detail: res_detail[0] };
        });
    }
}
const statementDao = new statementDeclaretionDao();
exports.default = statementDao;
