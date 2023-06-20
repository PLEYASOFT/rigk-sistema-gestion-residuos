import { Router } from "express";
import UtilesLogic from "../controllers/utilesLogic"
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/download/pdf', [], UtilesLogic.downloadPdf);
export default router;