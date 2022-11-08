import { Router } from "express";
import businessLogic from "../controllers/businessLogic";
import { verifyParameters } from "../middleware/checkUserBusiness";

const router = Router();

router.get('/verify/:id/:user', [ verifyParameters ], businessLogic.verifyId);

export default router;