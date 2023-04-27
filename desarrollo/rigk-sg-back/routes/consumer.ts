import { Router } from "express";
import IndustrialConsumer from "../controllers/industrialConsumer";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/verify/:year/:business', [validarJWT], IndustrialConsumer.verify);
router.get('/:id', [validarJWT], IndustrialConsumer.getForm);
router.get('/declaration/:id_header/:id_detail', [validarJWT], IndustrialConsumer.getDeclarationByID);
router.get('/consult/:id', [validarJWT], IndustrialConsumer.getFormConsulta);
router.get('/excel/:id', [validarJWT], IndustrialConsumer.downloadBulkUploadFile);
router.get('/detailMV/:id', [validarJWT], IndustrialConsumer.getMV);
router.get('/download/:id', [validarJWT], IndustrialConsumer.downloadFile);
router.delete('/detailMV/:id', [validarJWT], IndustrialConsumer.deleteById);
router.post('/', [validarJWT], IndustrialConsumer.saveForm);
router.post('/saveFile', [validarJWT], IndustrialConsumer.saveFile);
router.post('/headerForm', [validarJWT], IndustrialConsumer.saveHeaderData);
router.post('/detailForm', validarJWT, IndustrialConsumer.saveDetailData);
export default router;

