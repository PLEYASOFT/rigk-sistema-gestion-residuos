import { Router } from "express";
import goalsLogic from "../controllers/goalsLogic";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/goals', [validarJWT], goalsLogic.getAllGoals);
router.post('/saveGoals', [validarJWT], goalsLogic.saveGoals);
router.put('/updateGoals', [validarJWT], goalsLogic.updateGoals);
router.get('/goalsYear/:year', [validarJWT], goalsLogic.getGoalsYear);

export default router;