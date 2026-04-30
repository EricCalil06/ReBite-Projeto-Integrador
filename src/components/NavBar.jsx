function NavBar({ user }) {
  return (
    <nav className="flex gap-4 p-4 bg-slate-800 text-white">
      <button>Início</button>
      <button>Sobre</button>

      {!user ? (
        <button>Fazer Login</button>
      ) : (
        <>
          <button>Meu Perfil</button>

          {user.hasEstablishment && (
            <button className="bg-green-600">Acessar Loja</button>
          )}

          <button>Sair</button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
