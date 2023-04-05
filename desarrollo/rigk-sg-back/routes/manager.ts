import { Router } from "express";
import managerLogic from "../controllers/managerLogic";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();

router.post('/add', [validarJWT], managerLogic.addManager);
router.get('/all', [validarJWT], managerLogic.getAllManager);
router.get('/allMaterials', [validarJWT], managerLogic.getAllMaterials);
router.get('/:id', [validarJWT], managerLogic.getManager);
router.get('/type_material/:type_material/region/:region', [validarJWT], managerLogic.getManagersByMaterial);
router.delete('/delete/:id', [validarJWT], managerLogic.deleteManager);
export default router;
