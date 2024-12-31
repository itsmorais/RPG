import api from "./api";
import { Jogador } from "../interfaces/jogador";

export const confirmJogador = async (id: number, confirmed: number) => {
    const response = await api.patch(`/jogadores/${id}/confirm`, {
        confirmado: confirmed
    })
    return response.data
}

export const getJogadores = async () => {
    const response = await api.get<Jogador[]>("/jogadores");
    return response.data;
}

export const getJogadoresConfirmados = async () => {
    const response = await api.get<Jogador[]>("/jogadores/confirmados");
    return response.data;
}

export const cadastrarJogador = async (novoJogador: Omit<Jogador, "id">) => {
    const response = await api.post("/jogadores", novoJogador);
    return response;
}