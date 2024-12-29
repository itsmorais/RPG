import React, { useState } from "react";

interface GuildFormProps {
    onSubmit: (guildSize: number) => void;
    handleCleanGuildas: () => void;
}

const GuildaForm: React.FC<GuildFormProps> = ({ onSubmit ,handleCleanGuildas}) => {
    const [guildSize, setGuildSize] = useState(3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(guildSize);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-1/4">
            <div>
                <h1 className="text-2xl font-bold mb-6">Gerar Jogo</h1>

                <label className="block font-medium">Tamanho da Guilda</label>
                <input
                    type="number"
                    value={guildSize}
                    onChange={(e) => setGuildSize(Number(e.target.value))}
                    className="border rounded p-2 w-full"
                    min={3}
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-fit"
            >
                Gerar Guildas
            </button>

            <div
                onClick={() => handleCleanGuildas()}
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 w-fit rounded hover:bg-blue-600 "
            >
                Limpar Guildas
            </div>
        </form>
    );
};

export default GuildaForm;
