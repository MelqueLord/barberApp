import {Router} from "express";
import * as barberController from "../controllers/barber-controller"
import upload from "../middlewares/upload-middleware";

const router = Router();

router.post("/" , upload.single("foto"), barberController.postBarber);
router.get("/" , barberController.getBarber);
router.get("/:id", barberController.getBarberById);
router.put("/:id", barberController.putBarber );
router.delete("/:id", barberController.deleteBarber);


export default router;