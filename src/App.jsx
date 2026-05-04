import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

// AQUI SIM NÓS IMPORTAMOS AS PÁGINAS!
import Inicio from "./pages/Inicio/index.jsx";
import Sobre from "./pages/Sobre/index.jsx";
import Login from "./pages/Login/index.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="w-screen h-screen bg-slate-50">
        
        {/* A NavBar fica FORA do <Routes> porque ela aparece em todas as páginas */}
        <NavBar user={user} />

        {/* O <Routes> é o "palco" onde as páginas vão se revezar */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          
          <Route path="/sobre" element={<Sobre />} />
          
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;