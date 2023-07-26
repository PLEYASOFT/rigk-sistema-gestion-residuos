import { Router } from "express";
import maintainerRatesLogic from "../controllers/maintainerRatesLogic";
import ratesLogic from "../controllers/ratesLogic"
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/uf', [validarJWT], ratesLogic.getUfDay);
router.get('/uf/:date', [validarJWT], ratesLogic.getUfDate);
router.get('/clp', [validarJWT], ratesLogic.getRatesCLP);
router.get('/algo', [validarJWT], ratesLogic.getAllRates);
router.get('/:year', [validarJWT], ratesLogic.getRatesByYear);
router.post('/', [validarJWT], ratesLogic.saveRates);
router.put('/updateRatesYear', [validarJWT], ratesLogic.updateRates);
router.put('/rates/:id', [validarJWT], ratesLogic.updateRates);
export default router;