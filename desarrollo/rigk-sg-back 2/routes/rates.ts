import { Router } from "express";
import ratesLogic from "../controllers/ratesLogic"
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/uf', [validarJWT], ratesLogic.getUfDay);
router.get('/uf/:date', [validarJWT], ratesLogic.getUfDate);
router.get('/clp', [validarJWT], ratesLogic.getRatesCLP);
router.get('/:year', [validarJWT], ratesLogic.getRatesByYear);
export default router;