import { BaseRepository } from "./BaseRepository";
import { Class } from "../models/Classe";
import connection from "../database/connection";

export class ClassRepository extends BaseRepository<Class> {
    constructor() {
        super("classes");
    }

    async findByName(name: string): Promise<Class | undefined> {
        return await connection(this.tableName).where({ name }).first();
    }
}
