import loginImage from "../../assets/loginImage.png";
import logoReBiteH from "../../assets/logoReBiteH.png";

{/* 
    
    Por enquanto a página de cadastro não tem nada a mais do que a página de login
    Nos próximos commits, vou adicionar outros campos assim como etapas dentro do cadastro
    
*/}

function FormCadastro() {
  return (
    <div className="relative z-10 flex w-full max-w-7xl p-6 items-center gap-8">
        <div className="w-[50%] flex justify-center">
          <img
            src={loginImage}
            alt="Ilustração da tela de login"
            className="w-[100%]"
          />
        </div>

        {/* Formulário de Cadastro */}
        <div className="w-[50%] flex justify-center">
          <div className="bg-white rounded-[2rem] shadow-xl p-10 w-full max-w-md">
            <img
              src={logoReBiteH}
              alt="Logo ReBite"
              className="w-32 mb-4 items-center justify-center mx-auto"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
              Crie sua conta
              <br />
              para entrar
            </h2>

            <form className="flex flex-col gap-6">
              {/* Caixa e-mail */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="Coloque seu melhor e-mail"
                  className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                />
              </div>

              {/* Caixa senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="Crie uma senha"
                  className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                />
              </div>

              <div>
                <p className="text-gray-600">
                  Já tem uma conta?{" "}
                  <a href="/login" className="text-[#F55D22] font-bold">
                    Faça login aqui!
                  </a>
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-6 mt-6">
                <button
                  type="button"
                  className="w-1/2 py-3 bg-gray-50 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#F55D22] text-white font-bold rounded-full hover:bg-[#ff4800] transition-colors"
                  onClick={
                    ()=> alert("Cadastro realizado com sucesso!")
                    
                  }
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default FormCadastro;
