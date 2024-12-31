import { Jogador } from "../models/Jogador";
import { Guilda } from "../models/Guilda";
import { ClassID } from "../models/Classe";

export class AlgoritmoAnnealing {
  static async balanceGuilds(jogadores: Jogador[], guildSize: number): Promise<Guilda[]> {
    const numExecutions = 1000; // Número de execuções para buscar o melhor resultado
    const results = await Promise.all(
      Array.from({ length: numExecutions }).map(() =>
        this.runSingleExecution(jogadores, guildSize)
      )
    );

    // Retorna a configuração com a menor diferença de XP
    return results.reduce((best, current) =>
      this.calculateXPDiff(current) < this.calculateXPDiff(best)
        ? current
        : best
    );
  }

  private static async runSingleExecution(jogadores: Jogador[], guildSize: number): Promise<Guilda[]> {
    const numGuilds = Math.floor(jogadores.length / guildSize);
    if (numGuilds === 0) {
      throw new Error("Não há jogadores suficientes para preencher uma guilda.");
    }

    const guilds: Guilda[] = [];
    const jogadoresSobrando: Jogador[] = [...jogadores];

    // Helper: Formar guildas com requisitos mínimos
    const initGuilda = () => {
      for (let i = 0; i < numGuilds; i++) {
        const guild: Guilda = { jogadores: [], totalXP: 0 };

        const guerreiro = jogadoresSobrando.find((j) => j.class_id === ClassID.Guerreiro);
        const clerigo = jogadoresSobrando.find((j) => j.class_id === ClassID.Clerigo);
        const ranged = jogadoresSobrando.find(
          (j) => j.class_id === ClassID.Mago || j.class_id === ClassID.Arqueiro
        );

        if (!guerreiro || !clerigo || !ranged) {
          break; // Não é possível formar mais guildas válidas
        }

        guild.jogadores.push(guerreiro, clerigo, ranged);
        guild.totalXP += guerreiro.xp + clerigo.xp + ranged.xp;

        // Remove os jogadores usados dos jogadores restantes
        [guerreiro, clerigo, ranged].forEach((player) => {
          const index = jogadoresSobrando.indexOf(player);
          if (index !== -1) jogadoresSobrando.splice(index, 1);
        });

        guilds.push(guild);
      }
    };

    // Helper: Preencher guildas com os jogadores restantes
    const preencherGuilda = () => {
      for (const guild of guilds) {
        while (guild.jogadores.length < guildSize && jogadoresSobrando.length > 0) {
          const nextPlayer = jogadoresSobrando.shift();
          if (nextPlayer) {
            guild.jogadores.push(nextPlayer);
            guild.totalXP += nextPlayer.xp;
          }
        }
      }
    };

    // Helper: Refinar XP com validação de requisitos mínimos
    const refineXPBalance = () => {
      const maxIterations = 500;
      let temperature = 100;
      const coolingRate = 0.95;

      const calculateXPDiff = (): number => {
        const xpValues = guilds.map((g) => g.totalXP);
        return Math.max(...xpValues) - Math.min(...xpValues);
      };

      const swapJogadores = () => {
        const guildAIndex = Math.floor(Math.random() * guilds.length);
        const guildBIndex = Math.floor(Math.random() * guilds.length);

        if (guildAIndex === guildBIndex) return;

        const guildA = guilds[guildAIndex];
        const guildB = guilds[guildBIndex];

        if (guildA.jogadores.length === 0 || guildB.jogadores.length === 0) return;

        const playerAIndex = Math.floor(Math.random() * guildA.jogadores.length);
        const playerBIndex = Math.floor(Math.random() * guildB.jogadores.length);

        const playerA = guildA.jogadores[playerAIndex];
        const playerB = guildB.jogadores[playerBIndex];

        // Trocar jogadores apenas se guildSize e os requisitos forem respeitados
        guildA.jogadores[playerAIndex] = playerB;
        guildB.jogadores[playerBIndex] = playerA;

        guildA.totalXP = guildA.jogadores.reduce((sum, j) => sum + j.xp, 0);
        guildB.totalXP = guildB.jogadores.reduce((sum, j) => sum + j.xp, 0);

        if (!isValidGuild(guildA) || !isValidGuild(guildB)) {
          // Reverte a troca se for inválida
          guildA.jogadores[playerAIndex] = playerA;
          guildB.jogadores[playerBIndex] = playerB;

          guildA.totalXP = guildA.jogadores.reduce((sum, j) => sum + j.xp, 0);
          guildB.totalXP = guildB.jogadores.reduce((sum, j) => sum + j.xp, 0);
        }
      };

      for (let i = 0; i < maxIterations; i++) {
        const currentDiff = calculateXPDiff();

        swapJogadores();

        const newDiff = calculateXPDiff();
        const delta = newDiff - currentDiff;

        if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
          // Aceita a nova configuração
        }

        temperature *= coolingRate;
      }
    };

    // Helper: Garantir que as guildas atendem aos requisitos mínimos
    const isValidGuild = (guild: Guilda): boolean => {
      const hasGuerreiro = guild.jogadores.some((j) => j.class_id === ClassID.Guerreiro);
      const hasClerigo = guild.jogadores.some((j) => j.class_id === ClassID.Clerigo);
      const hasRanged = guild.jogadores.some(
        (j) => j.class_id === ClassID.Mago || j.class_id === ClassID.Arqueiro
      );
      return hasGuerreiro && hasClerigo && hasRanged;
    };

    // Inicialização estratégica
    initGuilda();
    preencherGuilda();

    // Refinamento para balancear XP
    refineXPBalance();

    // Remove guildas inválidas
    return guilds.filter(isValidGuild);
  }

  private static calculateXPDiff(guilds: Guilda[]): number {
    const xpValues = guilds.map((g) => g.totalXP);
    return Math.max(...xpValues) - Math.min(...xpValues);
  }
}
