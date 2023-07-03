import { Router } from "express";
import UtilesLogic from "../controllers/utilesLogic"
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/download/pdf', [], UtilesLogic.downloadPdf);
router.post('/upload/pdf', [validarJWT], UtilesLogic.saveFile);
router.post('/verifyUser', [validarJWT], UtilesLogic.verifyUser);
router.get('/download', [validarJWT], UtilesLogic.download);

export default router;