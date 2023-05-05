import { Router } from "express";
import establishmentLogic from "../controllers/establishmentLogic";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();
router.get('/all', [validarJWT], establishmentLogic.getAllEstablishment);
router.get('/declaration', [validarJWT], establishmentLogic.getDeclarationEstablishment);
router.get('/:id', [validarJWT], establishmentLogic.getEstablishment);
router.get('/get/:id', [validarJWT], establishmentLogic.getEstablishmentByID);
router.post('/add', [validarJWT], establishmentLogic.addEstablishment);
router.post('/get/invoice/', [], establishmentLogic.getInovice);
router.post('/invoiceX/', [], establishmentLogic.saveInvoice);
router.delete('/delete/:id', [validarJWT], establishmentLogic.deleteEstablishment);
export default router;