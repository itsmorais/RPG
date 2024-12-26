import { Router } from "express";
import { JogadorController } from "../controllers/JogadorController";
const router = Router();

// Listar todos os jogadores
router.get("/", JogadorController.getAllJogadores)

// Criar um jogador!
router.post("/", JogadorController.createJogador)

// Confirmar Jogador
router.patch("/:id/confirm", JogadorController.confirmaJogador)

export { router as jogadoresRoutes }