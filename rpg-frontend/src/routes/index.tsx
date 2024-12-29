import { Route, Routes } from "react-router-dom"
import CadastrarJogador from "../pages/CadastrarJogador"
import Home from "../pages/Home"
import AtivarJogador from "../pages/AtivarJogador";
export function Rotas() {
    return (
        <Routes>
            <Route path="/" element={< Home />} />
            <Route path="/cadastrarJogador" element={< CadastrarJogador />} />
            <Route path="/ativarJogador" element={< AtivarJogador />} />

        </Routes>

    );
}