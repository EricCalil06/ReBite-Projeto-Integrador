import { useState } from "react";
import NavBar from "./components/NavBar";

function App() {
  // State
  const [user, setUser] = useState({
    id: 1,
    name: "João",
    hasEstablishment: false, // Verdadeiro ou Falso
    role: "admin", // Isso aqui você vai usar depois!
  });

  return (
    <div className="w-screen h-screen bg-slate-50">
      <NavBar userType ={setUser} />
      <button
        className="text-white bg-slate-700 p-4 rounded-2xl"
      >
        Mudar para About
      </button>
    </div>
  );
}

export default App;
