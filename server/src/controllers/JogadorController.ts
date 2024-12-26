import { Request, Response } from "express";
import { JogadorRepository } from "../repositories/JogadorRepository";

const jogadorRepo = new JogadorRepository();

export class JogadorController {
    static async getAllJogadores(req: Request, res: Response) {
        try {
            const jogadores = await jogadorRepo.findAll();
            res.status(200).json(jogadores);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar jogadores" });
        }
    }

    static async createJogador(req: Request, res: Response) {
        const { name, class_id, xp } = req.body;
        try {

            if (xp > 100 || xp < 1) {
                res.status(400).json({ error: 'Jogador com XP maior que 100' });
            }

            const id = await jogadorRepo.create({ name, class_id, xp, confirmed: false });
            res.status(201).json({ id });
        } catch (error) {
            res.status(400).json({ error: 'Erro ao criar jogador' });
        }
    }

    static async confirmaJogador(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await jogadorRepo.update(Number(id), { confirmed: true });
            res.status(201).json({ message: "Jogador confirmado!" });
        } catch (error) {
            res.status(400).json({ error: 'Erro ao confirmar jogador' });
        }
    }


}