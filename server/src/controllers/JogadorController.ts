import { Request, Response } from "express";
import { JogadorRepository } from "../repositories/JogadorRepository";
import { ClassID } from "../models/Classe";
import { Jogador } from "../models/Jogador";

const jogadorRepo = new JogadorRepository();

export class JogadorController {


    static async getAllJogadores(req: Request, res: Response) {
        try {
            let jogadores = await jogadorRepo.findAll();
            jogadores = JogadorController.findClasses(jogadores)


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
        const { confirmado } = req.body

        try {
            const novoStatus = Number(confirmado) === 1 ? false : true

           const jogador =  await jogadorRepo.update(Number(id), { confirmed: novoStatus });
           console.log("ATUALIZADOOO STATUS:",jogador)
            res.status(201).json({ message: "Status alterado com sucesso!" });
        } catch (error) {
            res.status(400).json({ error: 'Erro ao confirmar jogador' });
        }
    }

    static async findConfirmedPlayers(req: Request, res: Response) {
        try {

            let jogadoresConfirmados = await jogadorRepo.findConfirmedPlayers();
            jogadoresConfirmados = JogadorController.findClasses(jogadoresConfirmados)

            res.status(200).json(jogadoresConfirmados);

        } catch (error: any) {
            res.status(400).json({ error: 'Erro ao buscar jogadores confirmados' });

        }
    }

    private static findClasses(jogadores: Jogador[]): Jogador[] {
        const classMap = {
            [ClassID.Guerreiro]: "Guerreiro",
            [ClassID.Mago]: "Mago",
            [ClassID.Arqueiro]: "Arqueiro",
            [ClassID.Clerigo]: "Clérigo",
        };

        return jogadores.map((jogador) => ({
            ...jogador,
            class_name: classMap[jogador.class_id as ClassID],
        }));

    }



}