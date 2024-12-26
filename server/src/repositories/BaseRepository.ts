import connection from "../database/connection";

export class BaseRepository<T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    };

    async findAll(): Promise<T[]> {
        return await connection(this.tableName).select("*");
    };

    async findById(id: number): Promise<T | undefined> {
        return await connection(this.tableName).where({ id }).first();
    }

    async create(data: Partial<T>): Promise<number> {
        const [id] = await connection(this.tableName).insert(data);
        return id;
    }

    async update(id: number, data: Partial<T>): Promise<void> {
        await connection(this.tableName).where({ id }).update(data);
    }

    async delete(id: number): Promise<void> {
        await connection(this.tableName).where({ id }).del();
    }
};

