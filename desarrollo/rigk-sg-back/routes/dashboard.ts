import { Router } from "express";
import dashboardLogic from "../controllers/dashboardLogic";
import { validarJWT } from "../middleware/validar-jwt";


const router = Router();
router.get('/get', [], dashboardLogic.getDashboard);

export default router;