"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statementProductorLogic_1 = __importDefault(require("../controllers/statementProductorLogic"));
const validar_jwt_1 = require("../middleware/validar-jwt");
const validatorsCustom_1 = require("../middleware/validators/validatorsCustom");
const rolesCustom_1 = require("../middleware/roles/rolesCustom");
const router = (0, express_1.Router)();
router.get('/:business/year/:year', [validar_jwt_1.validarJWT, rolesCustom_1.verifyRolProductor, validatorsCustom_1.verifyParametersStatementByYear], statementProductorLogic_1.default.getStatmentByYear);
router.post('/', [validar_jwt_1.validarJWT, rolesCustom_1.verifyRolProductor, validatorsCustom_1.verifyParametersProductorForm], statementProductorLogic_1.default.saveForm);
router.put('/:id/state/:state', [validar_jwt_1.validarJWT, rolesCustom_1.verifyRolProductor, validatorsCustom_1.verifyParametersUpdateStateForm], statementProductorLogic_1.default.updateStateForm);
router.all('**', (req, res) => { res.status(500).json({ status: false, msg: "Ruta incorrecta" }); });
exports.default = router;
