import { Knex } from "knex";
const config: { [key: string]: Knex.Config } = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: 'src/database/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: 'database/migrations',
    },
    seeds: {
      directory: 'database/seeds',
    }
  },


};
export default config;
