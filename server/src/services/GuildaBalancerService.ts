import { Jogador } from "../models/Jogador";
import { JogadorRepository } from "../repositories/JogadorRepository";
import { Guilda } from "../models/Guilda";
import { ClassID } from "../models/Classe";

const jogadorRepo = new JogadorRepository();

export class GuildaBalancerService {

    static async formarGuildas(guildSize: number): Promise<Guilda[]> {
        // 1 Buscar jogadores confirmados
        const jogadoresConfirmados = await jogadorRepo.findConfirmedPlayers();

        // 2 Mapear jogadores com o respectivo nome de classe
        const jogadoresClasse = await this.mapearNomesDeClasses(jogadoresConfirmados);

        // 3 Agrupar jogadores por classe
        const classes = this.agruparPorClasse(jogadoresClasse);

        // 4 Formar guildas : Implementar requerimentos e balanceamento de XP
        return this.balancearGuildas(classes, guildSize)
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

    private static balancearGuildas(classes: Record<string, Jogador[]>, guildSize: number): Guilda[] {
        // Logica para formar guildas garantindo as classes e balanceamento de XP

        const { guerreiro, mago, arqueiro, clerigos } = classes;
        let guildas: Guilda[] = [];
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

        guildas = guildas.filter((jogadores)=> jogadores.jogadores.length === guildSize);

        this.ajustarDiferencaDeXP(guildas, guildSize);
        console.log("GUILDAS APÓSSSSSSS AO AJUSTE DE XP",guildas)


        return guildas;

    }


    private static ajustarDiferencaDeXP(guildas: Guilda[], guild_size: number) {
        let maxXP = Math.max(...guildas.map((g) => g.totalXP));
        let minXP = Math.min(...guildas.map((g) => g.totalXP));
        let iteration = 0;
        let range = 10;
        const maxIteration = 200;


        while (maxXP - minXP > range) {
            iteration++;

            if (iteration > maxIteration) {
                console.warn("Limite de iterações atingido, impossível balancear XP com o range", range);
                range += 10;
                //throw new Error(`Limite de iterações atingido, impossível balancear XP com o range:${xp_range}`)

            }
            const richestGuild = guildas.find((guilda) => guilda.totalXP === maxXP)!;
            const poorestGuild = guildas.find((guilda) => guilda.totalXP === minXP)!;

            const melhorJogador = this.findBestSwap(richestGuild);
            const piorJogador = this.findBestSwap(poorestGuild);

            richestGuild.jogadores = richestGuild.jogadores.filter((j) => j.id != melhorJogador.id);
            poorestGuild.jogadores = poorestGuild.jogadores.filter((j) => j.id != piorJogador.id);

            richestGuild.jogadores.push(piorJogador);
            poorestGuild.jogadores.push(melhorJogador);

            richestGuild.totalXP = richestGuild.jogadores.reduce((sum, jogador) => sum + jogador.xp, 0);
            poorestGuild.totalXP = poorestGuild.jogadores.reduce((sum, jogador) => sum + jogador.xp, 0);

            maxXP = Math.max(...guildas.map((g) => g.totalXP));
            minXP = Math.min(...guildas.map((g) => g.totalXP));






        }


    }


    private static findBestSwap(guild: Guilda): Jogador {
        const hasGuerreiro = guild.jogadores.find((jogador) => jogador.class_id === ClassID.Guerreiro);
        const hasClerigo = guild.jogadores.find((jogador) => jogador.class_id === ClassID.Clerigo);
        const hasRanged = guild.jogadores.find(
            (jogador) => jogador.class_id === ClassID.Mago || jogador.class_id === ClassID.Arqueiro
        );

        let jogadoresRemanescentes = guild.jogadores.filter((jogadores => jogadores.id === hasGuerreiro?.id));
        jogadoresRemanescentes = guild.jogadores.filter((jogadores => jogadores.id === hasClerigo?.id));
        jogadoresRemanescentes = guild.jogadores.filter((jogadores => jogadores.id === hasRanged?.id));

        return jogadoresRemanescentes[0]
    }



}