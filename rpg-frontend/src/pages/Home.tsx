import React, { useEffect, useState } from "react";
import GuildaDisplay from "../components/GuildaDisplay";
import GuildaForm from "../components/GuildaForm";
import { getGuildas } from "../service/api";
import { useNavigate } from "react-router-dom";
import { Jogador } from "../interfaces/jogador";
import { Guilda } from "../interfaces/guilda";
import JogadoresTable from "../components/JogadoresTable";
import { getJogadoresConfirmados } from "../service/jogadorService";


const Home: React.FC = () => {
    const [guilds, setGuilds] = useState<Guilda[]>([]);
    const [jogadoresAtivos, setJogadoresAtivos] = useState<Jogador[]>([])
    const [jogadoresRemanescentes, setJogadoresRemanescentes] = useState<Jogador[]>([]);
    const [xpGap, setXpGap] = useState(0);

    const navigation = useNavigate()

    const handleFormSubmit = async (guildSize: number) => {
        try {
            const data: Guilda[] = await getGuildas(guildSize);
            setGuilds(data);

            const totalXP = data.map((guilda) => guilda.totalXP);
            const maiorXP = Math.max(...totalXP);
            const menorXP = Math.min(...totalXP);

            setXpGap(maiorXP - menorXP);


            const jogadoresSelecionadosIds = data.flatMap((guilda) => guilda.jogadores.map((j) => j.id))
            setJogadoresRemanescentes(jogadoresAtivos.filter((jogador) => !jogadoresSelecionadosIds.includes(jogador.id)));


        } catch (error: any) {
            console.error("Error generating guilds:", error.response?.data || error.message);
        }

    };

    const handleCleanGuildas = () => {
        setGuilds([]);
        setJogadoresRemanescentes([]);
    }

    useEffect(() => {
        // Buscar jogadores ativos
        const fetchClasses = async () => {
            try {
                const response = await getJogadoresConfirmados()
                setJogadoresAtivos(response);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, []);

    return (
        <div className="container mx-auto p-4">

            <div className="flex ">

                <GuildaForm onSubmit={handleFormSubmit} handleCleanGuildas={handleCleanGuildas} />



                <div className="container mx-auto  w-1/2">
                    {/*                 CADASTRAR JOGADORES BUTTON
 */}                    <h1 className="text-2xl font-bold mb-6 ">Gerenciar Jogadores</h1>
                    <div
                        onClick={() => navigation("/cadastrarJogador")}
                        className="cursor-pointer bg-blue-500 text-white py-2 px-4 w-fit rounded hover:bg-blue-600 "
                    >
                        Cadastrar Jogadores
                    </div>

                    <div
                        onClick={() => navigation("/ativarJogador")}
                        className="cursor-pointer mt-5 bg-blue-500 text-white py-2 px-4 w-fit rounded hover:bg-blue-600 "
                    >
                        Ativar Jogadores
                    </div>


                </div>
            </div>

            <div className="mt-5">
                {guilds.length > 0 ? (
                    <div className="">
                        <h1 className="mt-6 text-2xl font-bold">Guildas formadas:{guilds.length}</h1>
                        <p className="text-gray-600 mb-3">Maior diferença de XP entre guildas: <strong>{xpGap}</strong></p>


                        <GuildaDisplay guildas={guilds} />
                        <div className="mt-5">
                            <h1 className="my-6 text-2xl font-bold">Jogadores ativos remanescentes:{jogadoresRemanescentes.length}</h1>
                            < JogadoresTable jogadores={jogadoresRemanescentes} tableHeight={300} />
                        </div>
                    </div>

                ) : (
                    <>
                        <div className="w-full">
                            <p className="text-gray-600">Não há guildas para mostrar. Por favor gere as guildas.</p>

                            <h1 className="my-6 text-2xl font-bold">Jogadores ativos disponíveis:{jogadoresAtivos.length}</h1>
                            <JogadoresTable jogadores={jogadoresAtivos} tableHeight={500} />
                        </div>

                    </>
                )}
            </div>


        </div>
    );
};

export default Home;
