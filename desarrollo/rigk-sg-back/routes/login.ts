import { Router } from "express";
import loginLogic from "../controllers/loginLogic";
import recoveryLogic from "../controllers/recoveryLogic";
import sendCodeLogic from '../controllers/sendCodeLogic';


const router = Router();

router.post('/login', [ ], loginLogic.login);
router.post('/recovery', [ ], recoveryLogic.recovery);
router.post('/sendCode', [ ], sendCodeLogic.sendCode);


export default router;