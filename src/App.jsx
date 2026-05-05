import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import Inicio from "./pages/Inicio/index.jsx";
import Sobre from "./pages/Sobre/index.jsx";
import Login from "./pages/Login/index.jsx";
import Cadastro from "./pages/Cadastro/index.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="w-screen h-screen bg-slate-50">
        <NavBar user={user} />

        <Routes>
          <Route path="/" element={<Inicio />} />

          <Route path="/sobre" element={<Sobre />} />

          <Route path="/login" element={<Login />} />
          
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
