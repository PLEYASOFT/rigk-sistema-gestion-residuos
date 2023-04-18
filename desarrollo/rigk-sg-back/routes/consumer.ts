import { Router } from "express";
import IndustrialConsumer from "../controllers/industrialConsumer";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/verify/:year/:business', [validarJWT], IndustrialConsumer.verify);
router.get('/:id', [validarJWT], IndustrialConsumer.getForm);
router.get('/consult/:id', [validarJWT], IndustrialConsumer.getFormConsulta);
router.get('/excel/:id', [validarJWT], IndustrialConsumer.downloadBulkUploadFile);
router.post('/', [validarJWT], IndustrialConsumer.saveForm);
export default router;

