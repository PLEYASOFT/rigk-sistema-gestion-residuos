import { Router } from "express";
import businessLogic from "../controllers/businessLogic";
import { verifyParameters } from '../middleware/checkUserBusiness';
import { validarJWT } from "../middleware/validar-jwt";

const router = Router();

router.get('/verify/:id', [validarJWT, verifyParameters], businessLogic.verifyId);
router.get('/business/:id', [validarJWT, verifyParameters], businessLogic.getBusiness);

export default router;