import { Router } from "express";
import authLogic from '../controllers/authLogic';
import { validateLogin } from "../middleware/validateLogin";

const router = Router();

router.post('/', [], authLogic.login);
router.post('/modifyPassword', [], authLogic.modifyPassword);
router.post('/sendCode', [], authLogic.sendCode);
router.post('/sendCode/verify', [ ], authLogic.sendCodeVerify);
router.post('/sendCode/recovery', [ ], authLogic.recoveryPassword);

export default router;