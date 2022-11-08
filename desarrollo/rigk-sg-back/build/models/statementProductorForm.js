"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const statementProductorFormScheme = joi_1.default.object({
    header: joi_1.default.object({
        id_business: joi_1.default.number()
            .required(),
        year_statement: joi_1.default.number()
            .min(1000)
            .max(9999)
            .required(),
        state: joi_1.default.boolean(),
        created_by: joi_1.default.string()
            .required()
    }),
    detail: joi_1.default.object({
        precedence: joi_1.default.number()
            .required(),
        hazard: joi_1.default.number()
            .required(),
        recyclability: joi_1.default.number()
            .required(),
        type_residye: joi_1.default.number()
            .required(),
        value: joi_1.default.number()
            .required()
    }),
});
exports.default = statementProductorFormScheme;
