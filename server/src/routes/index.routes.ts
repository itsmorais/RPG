import { Router,Application } from "express";
import { jogadoresRoutes } from "./jogador.routes";
import { classRoutes } from "./classe.routes";
import { guildaRoutes } from "./guilda.routes";

const routes = Router();

routes.use("/jogadores", jogadoresRoutes);
routes.use("/classes", classRoutes);
routes.use("/guildas",guildaRoutes)

export const createRoutes = (server: Application) => {
    server.use("/api", routes);
}