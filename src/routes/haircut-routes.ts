import { Request, Response, Router } from "express";
import * as haircutController from "../controllers/haircuts-controller"
import upload from "../middlewares/upload-middleware";

const router = Router();

router.post("/", upload.single("foto"), haircutController.postHaircut);

export default router;

