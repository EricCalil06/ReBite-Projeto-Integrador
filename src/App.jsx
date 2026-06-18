import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import Inicio from "./pages/Inicio/index.jsx";
import Sobre from "./pages/Sobre/index.jsx";
import Login from "./pages/Login/index.jsx";
import Cadastro from "./pages/Cadastro/index.jsx";
import Footer from "./components/Footer.jsx";
import PaginaLojista from "./pages/PaginaParaLojistas/index.jsx"
//import Sacola from './pages/PaginaParaLojistas/sacola'; 
import CadastrarLoja from "./pages/PaginaParaLojistas/CadastrarLoja.jsx";
import PainelLoja from "./pages/PaginaParaLojistas/PainelLoja.jsx";
import Debug from "./pages/Debug/index.jsx"
import Conta from "./pages/Conta/index.jsx";
import AlterarSenha from "./pages/alterarSenha/AlterarSenha";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-slate-50">
        <NavBar/>
        <Routes>
          <Route path="/" element={<Inicio />} />

          <Route path="/sobre" element={<Sobre />} />

          <Route path="/login" element={<Login />} />
          
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/cadastro-lojista" element={<PaginaLojista />}/>

          <Route path="/alterar-senha" element={<AlterarSenha />} />
          
          <Route path="/cadastrar-loja" element={<CadastrarLoja />} />

          <Route path="/painel-loja" element={<PainelLoja />} />

          <Route path="/debug" element={<Debug />} />

          <Route path="/conta" element={<Conta />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
