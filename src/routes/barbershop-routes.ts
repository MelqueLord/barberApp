import { Router } from "express";
import * as barbershopController from "../controllers/barbershop-controller";

const router = Router();

router.post("/", barbershopController.postBarbershop);
router.get("/", barbershopController.getBarbershops);
router.get("/:id", barbershopController.getBarbershopById);
router.put("/:id", barbershopController.putBarbershop);
router.delete("/:id", barbershopController.deleteBarbershop);

export default router;