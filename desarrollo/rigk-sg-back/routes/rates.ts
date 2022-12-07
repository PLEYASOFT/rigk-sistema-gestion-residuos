import { Router } from "express";
import ratesLogic from "../controllers/ratesLogic"
import { validarJWT } from "../middleware/validar-jwt";

const router = Router();

router.get('/:year', [], ratesLogic.getRatesByYear);

export default router;