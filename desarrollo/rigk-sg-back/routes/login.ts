import { Router } from "express";
import loginLogic from "../controllers/loginLogic";
import sendCodeLogic from '../controllers/recoveryLogic';
import { veriryemail } from '../middleware/verifyemail';

const router = Router();

router.post('/login', [ ], loginLogic.login);
router.post('/sendCode/recovery', [ ], sendCodeLogic.recoveryPassword);
router.post('/sendCode', [], sendCodeLogic.sendCode);
router.post('/sendCode/verify', [ ], sendCodeLogic.sendCodeVerify);
export default router;