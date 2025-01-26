import {Router} from "express";
import * as postBarberController from "../controllers/barber-controller"
import upload from "../middlewares/upload-middleware";

const router = Router();

router.post("/" , upload.single("foto"), postBarberController.postBarber);

export default router;