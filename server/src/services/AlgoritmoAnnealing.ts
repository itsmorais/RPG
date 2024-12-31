import { Jogador } from "../models/Jogador";
import { Guilda } from "../models/Guilda";
import { ClassID } from "../models/Classe";

export class AlgoritmoAnnealing {
  static async balanceGuilds(players: Jogador[], guildSize: number): Promise<Guilda[]> {
    const numExecutions = 1000; // Número de execuções para buscar o melhor resultado
    const results = await Promise.all(
      Array.from({ length: numExecutions }).map(() =>
        this.runSingleExecution(players, guildSize)
      )
    );

    // Retorna a configuração com a menor diferença de XP
    return results.reduce((best, current) =>
      this.calculateXPDifference(current) < this.calculateXPDifference(best)
        ? current
        : best
    );
  }

  private static async runSingleExecution(players: Jogador[], guildSize: number): Promise<Guilda[]> {
    const numGuilds = Math.floor(players.length / guildSize);
    if (numGuilds === 0) {
      throw new Error("Not enough players to form a single guild.");
    }

    const guilds: Guilda[] = [];
    const remainingPlayers: Jogador[] = [...players];

    // Helper: Formar guildas com requisitos mínimos
    const initializeGuildsWithMinimumClasses = () => {
      for (let i = 0; i < numGuilds; i++) {
        const guild: Guilda = { jogadores: [], totalXP: 0 };

        const guerreiro = remainingPlayers.find((j) => j.class_id === ClassID.Guerreiro);
        const clerigo = remainingPlayers.find((j) => j.class_id === ClassID.Clerigo);
        const ranged = remainingPlayers.find(
          (j) => j.class_id === ClassID.Mago || j.class_id === ClassID.Arqueiro
        );

        if (!guerreiro || !clerigo || !ranged) {
          break; // Não é possível formar mais guildas válidas
        }

        guild.jogadores.push(guerreiro, clerigo, ranged);
        guild.totalXP += guerreiro.xp + clerigo.xp + ranged.xp;

        // Remove os jogadores usados dos jogadores restantes
        [guerreiro, clerigo, ranged].forEach((player) => {
          const index = remainingPlayers.indexOf(player);
          if (index !== -1) remainingPlayers.splice(index, 1);
        });

        guilds.push(guild);
      }
    };

    // Helper: Preencher guildas com os jogadores restantes
    const fillGuilds = () => {
      for (const guild of guilds) {
        while (guild.jogadores.length < guildSize && remainingPlayers.length > 0) {
          const nextPlayer = remainingPlayers.shift();
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

      const calculateXPDifference = (): number => {
        const xpValues = guilds.map((g) => g.totalXP);
        return Math.max(...xpValues) - Math.min(...xpValues);
      };

      const swapPlayers = () => {
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
        const currentDiff = calculateXPDifference();

        swapPlayers();

        const newDiff = calculateXPDifference();
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
    initializeGuildsWithMinimumClasses();
    fillGuilds();

    // Refinamento para balancear XP
    refineXPBalance();

    // Remove guildas inválidas
    return guilds.filter(isValidGuild);
  }

  private static calculateXPDifference(guilds: Guilda[]): number {
    const xpValues = guilds.map((g) => g.totalXP);
    return Math.max(...xpValues) - Math.min(...xpValues);
  }
}
