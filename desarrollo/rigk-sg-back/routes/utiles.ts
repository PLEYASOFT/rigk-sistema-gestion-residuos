import { Router } from "express";
import UtilesLogic from "../controllers/utilesLogic"
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/download/pdf', [], UtilesLogic.downloadPdf);
router.post('/verifyUser', [validarJWT], UtilesLogic.verifyUser);
router.post('/upload/pdf/:idEmpresa/:idUsuario', [validarJWT], UtilesLogic.saveFile);
router.get('/download/:idEmpresa/:idUsuario', [validarJWT], UtilesLogic.download);

export default router;