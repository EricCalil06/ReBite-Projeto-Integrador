import { Link } from "react-router-dom";

function NavBar({ user }) {
  return (
    <nav className="flex justify-between p-4 bg-slate-800 text-white">
      {/* LADO ESQUERDO DA NAVBAR */}
      <div className="flex gap-4 items-center mr-4 ml-4">    
        <Link to="/">Início</Link>
        <Link to="/sobre">Sobre</Link>
      </div>    
      
      {/* LADO DIREITO DA NAVBAR */}
      <div className="flex gap-4 items-center mr-4 ml-4">    
        {!user ? (
          <Link to="/login">
             <button className="bg-blue-600 p-2 rounded">Fazer Login</button>
          </Link>
        ) : (
          <>
            <h1>Bem Vindo {user.name}!</h1>
            <button>Meu Perfil</button>
            
            {user.hasEstablishment && (
              <button className="bg-green-600 p-2 rounded">Acessar Loja</button>
            )}

            <button className="bg-red-600 p-2 rounded">Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;