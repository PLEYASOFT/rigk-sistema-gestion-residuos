import { Router } from "express";
import goalsLogic from "../controllers/goalsLogic";
import maintainerRatesLogic from "../controllers/maintainerRatesLogic";
import ratesLogic from "../controllers/ratesLogic"
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/goals', [validarJWT], goalsLogic.getAllGoals);
// router.get('/:year', [validarJWT], goalsLogic.getRatesByYear);
router.post('/', [validarJWT], goalsLogic.saveRates);
router.put('/updateRatesYear', [validarJWT], goalsLogic.updateRates);
router.put('/rates/:id', [validarJWT], goalsLogic.updateRates);

export default router;