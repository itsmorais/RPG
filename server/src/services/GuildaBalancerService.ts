import { Jogador } from "../models/Jogador";
import { JogadorRepository } from "../repositories/JogadorRepository";
import { Guilda } from "../models/Guilda";
import { ClassID } from "../models/Classe";

const jogadorRepo = new JogadorRepository();

export class GuildaBalancerService {

    static async formarGuildas(guildSize: number, xp_range: number): Promise<Guilda[]> {
        // 1 Buscar jogadores confirmados
        const jogadoresConfirmados = await jogadorRepo.findConfirmedPlayers();

        // 2 Mapear jogadores com o respectivo nome de classe
        const jogadoresClasse = await this.mapearNomesDeClasses(jogadoresConfirmados);

        // 3 Agrupar jogadores por classe
        const classes = this.agruparPorClasse(jogadoresClasse);

        // 4 Formar guildas : Implementar requerimentos e balanceamento de XP
        return this.balancearGuildas(classes, guildSize, xp_range)
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


    private static agruparPorClasse(jogadores: Jogador[]): Record<string, Jogador[]> {
        return jogadores.reduce(
            (classes, jogador) => {
                switch (jogador.class_id) {
                    case 1:
                        classes.guerreiro.push(jogador);
                        break;
                    case 2:
                        classes.mago.push(jogador);
                        break;
                    case 3:
                        classes.arqueiro.push(jogador);
                        break;
                    case 4:
                        classes.clerigos.push(jogador);
                        break;
                }
                return classes;
            },
            { guerreiro: [], mago: [], arqueiro: [], clerigos: [] } as Record<string, Jogador[]>
        )
    }

    private static findClassWithMorePlayers(classes: Record<string, Jogador[]>): Jogador[] | null {

        const sortedClasses = Object.entries(classes)
            .filter(([, jogadores]) => jogadores.length > 0) // Remove classes zeradas
            .sort(([, jogadoresA], [, jogadoresB]) => jogadoresB.length - jogadoresA.length); // Ordena pelos jogadores remanescentes

        // Retorna a classe com a maior quantidade de jogadores disponiveis
        return sortedClasses.length > 0 ? sortedClasses[0][1] : null;
    }

    private static balancearGuildas(classes: Record<string, Jogador[]>, guildSize: number, xp_range: number): Guilda[] {
        // Logica para formar guildas garantindo as classes e balanceamento de XP

        const { guerreiro, mago, arqueiro, clerigos } = classes;
        const guildas: Guilda[] = [];
        const jogadoresSobrando: Jogador[] = [];

        // Inicializando guida com o requerimento mínimo
        while (guerreiro.length && clerigos.length && (mago.length || arqueiro.length)) {
            const guildaJogadores: Jogador[] = [
                guerreiro.shift()!,
                clerigos.shift()!,
                mago.length ? mago.shift()! : arqueiro.shift()!,
            ];


            // Preencher slots vazios até garantir o tamanha da guilda
            while (guildaJogadores.length < guildSize) {
                const classeComMaisJogadores = this.findClassWithMorePlayers({
                    guerreiro, mago, arqueiro, clerigos,
                });

                if (classeComMaisJogadores) {
                    // Adiciona o jogador de uma classe com mais jogadores disponíveis
                    const jogador = classeComMaisJogadores.shift();
                    if (jogador) guildaJogadores.push(jogador);
                } else {
                    break;
                }
            }



            guildas.push({
                jogadores: guildaJogadores,
                totalXP: guildaJogadores.reduce((sum, jogador) => sum + jogador.xp, 0),
            });
        }

        jogadoresSobrando.push(...guerreiro, ...mago, ...arqueiro, ...clerigos);

        //this.balancearJogadoresRemanescentes(jogadoresSobrando, guildas, guildSize);

        this.ajustarDiferencaDeXP(guildas, guildSize, xp_range);

        return guildas;

    }

    /*  private static balancearJogadoresRemanescentes(jogadoresRemanescentes: Jogador[], guildas: Guilda[], guild_size: number) {
         for (const jogador of jogadoresRemanescentes) {
 
             // Encontrar guilda com espaço
             const guildSlot = guildas.find((guild) => guild.jogadores.length < guild_size);
             if (guildSlot) {
                 guildSlot.jogadores.push(jogador);
                 guildSlot.totalXP += jogador.xp;
             }
 
         }
 
     } */

    private static ajustarDiferencaDeXP(guildas: Guilda[], guild_size: number, xp_range: number) {
        let maxXP = Math.max(...guildas.map((g) => g.totalXP));
        let minXP = Math.min(...guildas.map((g) => g.totalXP));
        let iteration = 0;
        const maxIteration = 100;


        while (maxXP - minXP > xp_range) {

            iteration++;

            if (iteration > maxIteration) {
                console.warn("Limite de iterações atingido, impossível balancear XP com o range", xp_range);
                throw new Error(`Limite de iterações atingido, impossível balancear XP com o range:${xp_range}`)

            }
            const richestGuild = guildas.find((guilda) => guilda.totalXP === maxXP)!;
            const poorestGuild = guildas.find((guilda) => guilda.totalXP === minXP)!;

            const bestSwap = this.findBestSwap(richestGuild, poorestGuild, guild_size);

            if (bestSwap) {
                const { melhorJogador, piorJogador } = bestSwap

                richestGuild.jogadores = richestGuild.jogadores.filter((j) => j.id != melhorJogador.id);
                poorestGuild.jogadores = poorestGuild.jogadores.filter((j) => j.id != piorJogador.id);

                richestGuild.jogadores.push(piorJogador);
                poorestGuild.jogadores.push(melhorJogador);

                richestGuild.totalXP = richestGuild.jogadores.reduce((sum, jogador) => sum + jogador.xp, 0);
                poorestGuild.totalXP = poorestGuild.jogadores.reduce((sum, jogador) => sum + jogador.xp, 0);

                maxXP = Math.max(...guildas.map((g) => g.totalXP));
                minXP = Math.min(...guildas.map((g) => g.totalXP));


            } else {
                break;
            }



        }


    }






    private static isValidGuild(guild: Jogador[]): boolean {
        const hasGuerreiro = guild.some((jogador) => jogador.class_id === ClassID.Guerreiro);
        const hasClerigo = guild.some((jogador) => jogador.class_id === ClassID.Clerigo);
        const hasRanged = guild.some(
            (jogador) => jogador.class_id === ClassID.Mago || jogador.class_id === ClassID.Arqueiro
        );

        return hasGuerreiro && hasClerigo && hasRanged;
    }

    private static findBestSwap(richestGuild: Guilda, poorestGuild: Guilda, guild_size: number) {
        let bestSwap: { melhorJogador: Jogador; piorJogador: Jogador } | null = null;
        let minXPDiference = 0;

        for (const melhorJogador of richestGuild.jogadores) {
            for (const piorJogador of poorestGuild.jogadores) {

                // Troca de posição temporaria
                const richestGuildTemp = richestGuild.jogadores.filter((j) => j.id != melhorJogador.id)
                const poorestGuildTemp = poorestGuild.jogadores.filter((j) => j.id != piorJogador.id)

                richestGuildTemp.push(piorJogador);
                poorestGuildTemp.push(melhorJogador);

                if (
                    this.isValidGuild(richestGuildTemp) &&
                    this.isValidGuild(poorestGuildTemp) &&
                    richestGuildTemp.length <= guild_size &&
                    poorestGuildTemp.length <= guild_size
                ) {
                    // Calculate new XP totals
                    const richestGuildXP = richestGuildTemp.reduce((sum, j) => sum + j.xp, 0);
                    const poorestGuildXP = poorestGuildTemp.reduce((sum, j) => sum + j.xp, 0);
                    const newXPDifference = Math.abs(richestGuildXP - poorestGuildXP);

                    // Check if this swap improves balance
                    if (newXPDifference < minXPDiference) {
                        minXPDiference = newXPDifference;
                        bestSwap = { melhorJogador, piorJogador };
                    }

                }


            }
        }
        return bestSwap;
    }

}