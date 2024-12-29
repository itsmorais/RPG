import React, { useEffect, useState } from "react";
import GuildaDisplay from "../components/GuildaDisplay";
import GuildaForm from "../components/GuildaForm";
import api, { getGuildas } from "../service/api";
import { useNavigate } from "react-router-dom";
import { Jogador } from "../interfaces/jogador";
import JogadoresTable from "../components/JogadoresTable";

const Home: React.FC = () => {
    const [guilds, setGuilds] = useState([]);
    const [jogadoresAtivos, setJogadoresAtivos] = useState<Jogador[]>([])

    const navigation = useNavigate()

    const handleFormSubmit = async (guildSize: number) => {
        try {
            const data = await getGuildas(guildSize);
            setGuilds(data);
        } catch (error: any) {
            console.error("Error generating guilds:", error.response?.data || error.message);
        }
        
    };

    const handleCleanGuildas = () => {
        setGuilds([]);
    }

    useEffect(() => {
        // Buscar jogadores ativos
        const fetchClasses = async () => {
            try {
                const response = await api.get<Jogador[]>("/jogadores/confirmados");
                setJogadoresAtivos(response.data);
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

            <div className="mt-6">
                {guilds.length > 0 ? (
                    <GuildaDisplay guildas={guilds} />
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
