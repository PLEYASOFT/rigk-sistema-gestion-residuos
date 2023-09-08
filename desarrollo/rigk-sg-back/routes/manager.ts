import { Router } from "express";
import managerLogic from "../controllers/managerLogic";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();

router.post('/add', [validarJWT], managerLogic.addManager);
router.get('/all', [validarJWT], managerLogic.getAllManager);
router.get('/allMaterials', [validarJWT], managerLogic.getAllMaterials);
router.get('/materials/:materials/region/:region', [validarJWT], managerLogic.getManagersByMaterial);
router.get('/excel', [validarJWT], managerLogic.downloadBulkUploadFileInvoice);
router.delete('/delete/:id', [validarJWT], managerLogic.deleteManager);
router.get('/:id', [validarJWT], managerLogic.getManager);
export default router;

