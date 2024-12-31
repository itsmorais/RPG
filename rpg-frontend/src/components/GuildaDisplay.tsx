import React from "react";
import { Guilda } from "../interfaces/guilda";
import { Jogador } from "../interfaces/jogador";

interface GuildDisplayProps {
    guildas: Guilda[];
}

const GuildaDisplay: React.FC<GuildDisplayProps> = ({ guildas }) => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
            {guildas.map((guild, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow hover:drop-shadow-2xl cursor-text">
                    <h2 className="text-lg font-bold">Guilda {index + 1}</h2>
                    <p>Total XP: {guild.totalXP}</p>
                    <p>Quantidade de jogadores: {guild.jogadores.length}</p>
                    <ul className="mt-2">
                        {guild.jogadores.map((player: Jogador) => (
                            <li key={player.id} className="text-gray-700">
                                {player.name} - ({player.class_name}) - {player.xp} XP
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default GuildaDisplay;
