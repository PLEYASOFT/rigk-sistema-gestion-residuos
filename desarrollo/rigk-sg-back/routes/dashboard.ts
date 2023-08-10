import { Router } from "express";
import dashboardLogic from "../controllers/dashboardLogic";
import { validarJWT } from "../middleware/validar-jwt";


const router = Router();
router.get('/get', [validarJWT], dashboardLogic.getDashboard);
router.get('/getSemester', [validarJWT], dashboardLogic.getSemesterDashboard);
router.get('/getMatYears', [validarJWT], dashboardLogic.getYearlyMaterialWeights);
router.get('/getPOM/:year', [], dashboardLogic.getAllTonByYear);
router.get('/getBusiness', [], dashboardLogic.getCountBusiness);


export default router;