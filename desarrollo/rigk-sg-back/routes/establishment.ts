import { Router } from "express";
import establishmentLogic from "../controllers/establishmentLogic";
import { validarJWT } from "../middleware/validar-jwt";
import { verifyParametersGetInvoice, verifyParametersSaveInvoice } from "../middleware/validators/getInvoice";
const router = Router();

router.get('/getIdByEstablishment/:id_vu/:region/:comuna/:name', [validarJWT], establishmentLogic.getIdByEstablishment);
router.get('/all', [validarJWT], establishmentLogic.getAllEstablishment);
router.get('/declaration', [validarJWT], establishmentLogic.getDeclarationEstablishment);
router.get('/:id', [validarJWT], establishmentLogic.getEstablishment);
router.get('/get/:id', [validarJWT], establishmentLogic.getEstablishmentByID);
router.post('/add', [validarJWT], establishmentLogic.addEstablishment);
router.post('/get/invoice/', [validarJWT, verifyParametersGetInvoice], establishmentLogic.getInovice);
router.post('/invoice/', [validarJWT, verifyParametersSaveInvoice], establishmentLogic.saveInvoice);
router.delete('/delete/:id', [validarJWT], establishmentLogic.deleteEstablishment);
export default router;