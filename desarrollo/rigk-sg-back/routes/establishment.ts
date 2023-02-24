import { Router } from "express";
import establishmentLogic from "../controllers/establishmentLogic";
import { validarJWT } from "../middleware/validar-jwt";

const router = Router();

router.post('/add', [validarJWT], establishmentLogic.addEstablishment);
router.get('/all', [validarJWT], establishmentLogic.getAllEstablishment);
router.get('/declaration', [validarJWT], establishmentLogic.getDeclarationEstablishment);
router.get('/:id', [validarJWT], establishmentLogic.getEstablishment);
router.delete('/delete/:id', [validarJWT], establishmentLogic.deleteEstablishment);
export default router;