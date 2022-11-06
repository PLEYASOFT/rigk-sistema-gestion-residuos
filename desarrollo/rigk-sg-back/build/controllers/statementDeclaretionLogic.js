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
const statementDeclaretionDao_1 = __importDefault(require("../dao/statementDeclaretionDao"));
class StatementDeclaretionLogic {
    previous(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year, business } = req.params;
            const statement = yield statementDeclaretionDao_1.default.getDeclaretionByYear(business, year);
            res.status(200).json({
                status: true,
                data: statement
            });
        });
    }
    saveForm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { header, business } = req.body;
        });
    }
}
const statementDeclaretionLogic = new StatementDeclaretionLogic();
exports.default = statementDeclaretionLogic;
