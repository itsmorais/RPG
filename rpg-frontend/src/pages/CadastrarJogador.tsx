import React, { useState, useEffect } from "react";
import { Jogador } from "../interfaces/jogador";
import { RPGClass } from "../interfaces/classes";
import api from "../service/api";

const CadastrarJogador: React.FC = () => {
    const [name, setName] = useState("");
    const [classId, setClassId] = useState<number | null>(null);
    const [xp, setXp] = useState(1);
    const [classes, setClasses] = useState<RPGClass[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Buscar as classes
        const fetchClasses = async () => {
            try {
                const response = await api.get<RPGClass[]>("/classes");
                setClasses(response.data);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classId) {
            setMessage("Por favor, Selecione uma classe.");
            return;
        }

        const novoJogador: Omit<Jogador, "id"> = {
            name,
            class_id: classId,
            class_name: classes.find((cls) => cls.id === classId)?.name || "",
            xp,
            confirmed: 0,
        };

        try {
            const response = await api.post("/jogadores", novoJogador);
            if (response.status === 201) {
                setMessage(`Jogador "${name}-Código:${response.data.id}" cadastrado com sucesso!`);
                setName("");
                setClassId(null);
                setXp(1);
            }
        } catch (error) {
            console.error("Error creating player:", error);
            setMessage("Failed to create player. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cadastrar Jogador</h1>

            {message && <p className="mb-4 text-center text-blue-600">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="block text-sm font-medium">Nome do Jogador</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Digite o nome"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Classe</label>
                    <select
                        value={classId || ""}
                        onChange={(e) => setClassId(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="" disabled>
                            Selecione uma classe
                        </option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">XP (1-100)</label>
                    <input
                        type="number"
                        value={xp}
                        onChange={(e) => setXp(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        min={1}
                        max={100}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Criar Jogador
                </button>
            </form>
        </div>
    );
};

export default CadastrarJogador;
