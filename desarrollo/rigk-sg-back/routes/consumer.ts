import { Router } from "express";
import IndustrialConsumer from "../controllers/industrialConsumer";

import { verifyParameters } from '../middleware/checkUserBusiness';
import { validarJWT } from "../middleware/validar-jwt";

const router = Router();

router.get('/:id', [validarJWT], IndustrialConsumer.getForm);
router.post('/', [validarJWT], IndustrialConsumer.saveForm);

export default router;

