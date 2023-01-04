import { Router } from "express";
import businessLogic from "../controllers/businessLogic";
import { verifyParameters } from '../middleware/checkUserBusiness';
import { validarJWT } from "../middleware/validar-jwt";

const router = Router();

router.get('/verify/:id', [validarJWT, verifyParameters], businessLogic.verifyId);
router.get('/business/:id', [validarJWT, verifyParameters], businessLogic.getBusiness);
router.get('/business', [validarJWT, verifyParameters], businessLogic.getAllBusiness);
router.post('/business', [validarJWT, verifyParameters], businessLogic.postBusiness);
router.delete('/business/:id', [validarJWT, verifyParameters], businessLogic.deleteBusiness);
router.put('/business/:id', [validarJWT, verifyParameters], businessLogic.updateBusiness);
export default router;