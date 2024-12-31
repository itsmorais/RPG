import React, { useEffect, useState } from "react";
import { Jogador } from "../interfaces/jogador";
import JogadoresTable from "../components/JogadoresTable";
import { getJogadores, confirmJogador } from "../service/jogadorService";

const AtivarJogador: React.FC = () => {
    const [jogadores, setJogadores] = useState<Jogador[]>([])
    const [statusAlterado, setStatusAlterado] = useState(false);



    useEffect(() => {
        // Buscar todos os jogadores
        const fetchClasses = async () => {
            try {
                const jogadores = await getJogadores();
                setJogadores(jogadores);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, [statusAlterado]);


    const handleJogador = async (jogador: Jogador,) => {
        const confirma = window.confirm(`Tem certeza que deseja alterar o status do jogador:${jogador.name}`)
        if (confirma) {
            try {

                const confirmarJogador = await confirmJogador(jogador.id, jogador.confirmed);
                alert(confirmarJogador.message)
                setStatusAlterado(!statusAlterado)

            } catch (error: any) {
                alert(error.message)
            }
        }
        console.log("Jogador recebido!", jogador);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="my-6 text-2xl font-bold">Total de jogadores:{jogadores.length}</h1>
            <p className="text-gray-600 mb-3">Clique sobre um jogador para alterar o status.</p>
            <JogadoresTable jogadores={jogadores} ativadorJogador={handleJogador} tableHeight={700} />
        </div>
    );
};

export default AtivarJogador;
