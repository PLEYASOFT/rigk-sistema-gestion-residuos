import { Router } from "express";
import ratesLogic from "../controllers/ratesLogic"
import { validarJWT } from "../middleware/validar-jwt";

const router = Router();

router.get('/uf', [], ratesLogic.getUfDay);
router.get('/clp', [], ratesLogic.getRatesCLP);
router.get('/:year', [], ratesLogic.getRatesByYear);

export default router;