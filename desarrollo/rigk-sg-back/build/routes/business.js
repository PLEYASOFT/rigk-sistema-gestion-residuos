"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessLogic_1 = __importDefault(require("../controllers/businessLogic"));
const checkUserBusiness_1 = require("../middleware/checkUserBusiness");
const router = (0, express_1.Router)();
router.get('/verify/:id/:user', [checkUserBusiness_1.verifyParameters], businessLogic_1.default.verifyId);
exports.default = router;
