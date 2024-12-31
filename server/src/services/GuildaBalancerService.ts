import { Jogador } from "../models/Jogador";
import { JogadorRepository } from "../repositories/JogadorRepository";
import { Guilda } from "../models/Guilda";
import { ClassID } from "../models/Classe";
import { AlgoritmoAnnealing} from "./AlgoritmoAnnealing";

const jogadorRepo = new JogadorRepository();

export class GuildaBalancerService {
    static async formarGuildas(guildSize: number): Promise<Guilda[]> {

        // 1 Buscar jogadores confirmados
        const jogadoresConfirmados = await jogadorRepo.findConfirmedPlayers();

        // 2 Mapear jogadores com o respectivo nome de classe
        const jogadoresClasse = await this.mapearNomesDeClasses(jogadoresConfirmados);

        // 3 Formar guildas : Implementar requerimentos e balanceamento de XP
        return   AlgoritmoAnnealing.balanceGuilds(jogadoresClasse,guildSize)
    }


    private static async mapearNomesDeClasses(jogadores: Jogador[]): Promise<Jogador[]> {
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