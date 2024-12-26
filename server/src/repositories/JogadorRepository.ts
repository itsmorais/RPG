import { BaseRepository } from "./BaseRepository";
import { Jogador } from "../models/Jogador";
import connection from "../database/connection";
export class JogadorRepository extends BaseRepository<Jogador> {
    constructor() {
        super("jogadores");
    }

    async findConfirmedPlayers(): Promise<Jogador[]> {
        return await connection(this.tableName).where({ confirmed: true }).select("*");
    }
}
