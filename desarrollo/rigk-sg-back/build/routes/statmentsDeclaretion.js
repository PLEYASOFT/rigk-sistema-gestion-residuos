"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statementDeclaretionLogic_1 = __importDefault(require("../controllers/statementDeclaretionLogic"));
const router = (0, express_1.Router)();
router.get('/:business/previous/:year', [], statementDeclaretionLogic_1.default.previous);
router.post('/', [], statementDeclaretionLogic_1.default.saveForm);
