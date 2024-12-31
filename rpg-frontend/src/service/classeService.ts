import api from "./api";
import { RPGClass } from "../interfaces/classes";

export const getClasses = async () => {
    const response = await api.get<RPGClass[]>("/classes")
    return response.data
}
