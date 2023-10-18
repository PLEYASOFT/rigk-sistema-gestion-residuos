import { Router } from "express";
import businessLogic from "../controllers/businessLogic";
import { verifyParameters } from '../middleware/checkUserBusiness';
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();

router.get('/business/check/:establishmentId/:businessId/:specificType', [validarJWT, verifyParameters], businessLogic.checkEstablishmentBusinessRelation);
router.get('/business/vat/:vat', [validarJWT, verifyParameters], businessLogic.getBusinessByVAT);
router.get('/verify/:id', [validarJWT, verifyParameters], businessLogic.verifyId);
router.get('/business/:id', [validarJWT, verifyParameters], businessLogic.getBusiness);
router.get('/businessById/:id/:year', [validarJWT], businessLogic.getAllBusinessById);
router.get('/business', [validarJWT, verifyParameters], businessLogic.getAllBusiness);
router.get('/user', [validarJWT], businessLogic.getBusinessByUser);
router.get('/getBusinessByUserId/:id', [], businessLogic.getBusinessByUserId);
router.post('/business', [validarJWT, verifyParameters], businessLogic.postBusiness);
router.delete('/business/:id', [validarJWT, verifyParameters], businessLogic.deleteBusiness);
router.put('/business/:id', [validarJWT, verifyParameters], businessLogic.updateBusiness);
export default router;