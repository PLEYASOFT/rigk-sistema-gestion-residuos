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
const statementProductorDao_1 = __importDefault(require("../dao/statementProductorDao"));
class StatementProductorLogic {
    getStatmentByYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year, business } = req.params;
            try {
                const statement = yield statementProductorDao_1.default.getDeclaretionByYear(business, year);
                res.status(200).json({
                    status: true,
                    data: statement
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    msg: "Algo salió mal"
                });
            }
        });
    }
    saveForm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { header, detail } = req.body;
                const { id_header } = yield statementProductorDao_1.default.saveDeclaretion(header, detail);
                res.status(200).json({
                    status: true,
                    data: id_header
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    msg: "Algo salió mal"
                });
            }
        });
    }
    updateStateForm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, state } = req.params;
            try {
                yield statementProductorDao_1.default.changeStateHeader(Boolean(state), parseInt(id));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    msg: "Algo salió mal"
                });
            }
        });
    }
}
const statementProductorLogic = new StatementProductorLogic();
exports.default = statementProductorLogic;
