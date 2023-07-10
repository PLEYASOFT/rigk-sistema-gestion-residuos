import { Router } from "express";
import logsLogic from "../controllers/logsLogic";
import { validarJWT } from "../middleware/validar-jwt";


const router = Router();
router.get('/', [validarJWT], logsLogic.addExcel);
router.post('/', [validarJWT], logsLogic.downloadLogsExcel);
router.post('/error', [validarJWT], logsLogic.errorExcel);

export default router;