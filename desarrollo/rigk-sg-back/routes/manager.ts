import { Router } from "express";
import managerLogic from "../controllers/managerLogic";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();


router.post('/add', [validarJWT], managerLogic.addManager);
router.get('/regiones', [validarJWT], managerLogic.getAllRegions);
router.get('/regiones/:id', [validarJWT], managerLogic.getRegionFromID);
router.get('/comunas', [validarJWT], managerLogic.getAllCommunes);
router.get('/communesFormatted', [validarJWT], managerLogic.getCommunesFormatted);
router.get('/submaterial', [validarJWT], managerLogic.getAllSubmaterial);
router.get('/submaterialFormatted', [validarJWT], managerLogic.getMaterialsFormatted);
router.get('/all', [validarJWT], managerLogic.getAllManager);
router.get('/allMaterials', [validarJWT], managerLogic.getAllMaterials);
router.get('/allTreatments', [validarJWT], managerLogic.getAllTreatments);
router.get('/materials/:materials/region/:region', [validarJWT], managerLogic.getManagersByMaterial);
router.get('/excel', [validarJWT], managerLogic.downloadBulkUploadFileInvoice);
router.delete('/delete/:id', [validarJWT], managerLogic.deleteManager);
router.get('/:id', [validarJWT], managerLogic.getManager);
export default router;

