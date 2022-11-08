"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginLogic_1 = __importDefault(require("../controllers/loginLogic"));
const recoveryLogic_1 = __importDefault(require("../controllers/recoveryLogic"));
const sendCodeLogic_1 = __importDefault(require("../controllers/sendCodeLogic"));
const router = (0, express_1.Router)();
router.post('/login', [], loginLogic_1.default.login);
router.post('/recovery', [], recoveryLogic_1.default.recovery);
router.post('/sendCode', [], sendCodeLogic_1.default.sendCode);
exports.default = router;
