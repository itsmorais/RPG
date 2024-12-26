import { Request, Response } from "express";
import { GuildaBalancerService } from "../services/GuildaBalancerService";

export class GuildaController {
    static async formarGuildas(req: Request, res: Response) {
        const { guild_size, xp_range } = req.body;
        try {
            const guildas = await GuildaBalancerService.formarGuildas(guild_size, xp_range);
            res.status(200).json(guildas);
        } catch (error: any) {
            if (error.message.includes(`Limite de iterações atingido, impossível balancear XP com o range`)) {
                res.status(400).json({ massage: error.message })
            } else {
                res.status(500).json({ error: "Erro ao formar guildas" });

            }
        }
    }
}
