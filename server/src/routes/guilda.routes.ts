import { Router } from "express";
import { GuildaController } from "../controllers/GuildaController";
const router = Router();

router.post("/", GuildaController.formarGuildas)


export { router as guildaRoutes }