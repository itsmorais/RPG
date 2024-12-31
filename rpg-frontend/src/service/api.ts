import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3022/api",
});

export const getGuildas = async (guildSize: number) => {
    const response = await api.post("/guildas", {
        guild_size: guildSize,
    });
    return response.data
}



export default api;