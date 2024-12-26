import { Router } from "express";
import { ClassController } from "../controllers/ClasseControler";
const router: Router = Router();

// Listar todas
router.get("/", ClassController.getAllClasses)
router.post("/", ClassController.createClass)

export { router as classRoutes };