import { useState } from "react";
import loginImage from "../../assets/loginImage.png";
import logoReBiteH from "../../assets/logoReBiteH.png";

function FormCadastro({ step, goToNextStep }) {
  const [aceitouTermos, setAceitouTermos] = useState(false);

  return (
    <div className="relative z-10 flex w-full max-w-7xl p-6 items-center gap-8">
      {/* Imagem Lateral */}
      <div className="w-[50%] flex justify-center">
        <img
          src={loginImage}
          alt="Ilustração da tela de login"
          className="w-[100%]"
        />
      </div>

      {/* Caixa do Formulário */}
      <div className="w-[50%] flex justify-center">
        <div className="bg-white rounded-[2rem] shadow-xl p-10 w-full max-w-md">
          {/* Logo e Título */}
          <img
            src={logoReBiteH}
            alt="Logo ReBite"
            className="w-32 mb-4 items-center justify-center mx-auto"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-tight text-center">
            Crie sua conta
          </h2>

          <form className="flex flex-col gap-6">
            {/* Etapa 1: Credenciais */}
            {step === 1 && (
              <>
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
              </>
            )}

            {/* Etapa 2: Dados Pessoais */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22] text-gray-500"
                  />
                </div>
              </>
            )}

            {/* Etapa 3: Informações Adicionais */}
            {step === 3 && (
              <>
                {/* Vou mudar aqui depois para revisar os dados do usuário antes dele finalizar o cadastro */}
                {/* Por enquanto vai ficar só a parte de aceitar os termos mesmo. */}
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Revise seus dados</label>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Nome: {name}</label>
                  
                </div> */}
                <div className="flex items-center gap-2 px-2 mt-2">
                  <input
                    type="checkbox"
                    required={true}
                    id="termos"
                    className="w-4 h-4 accent-[#F55D22]"
                    checked={aceitouTermos}
                    onChange={(event) => setAceitouTermos(event.target.checked)}
                  />
                  <label htmlFor="termos" className="text-sm text-gray-600">
                    Aceito os{" "}
                    <a href="#" className="text-[#F55D22] font-bold">
                      Termos de Uso
                    </a>
                  </label>
                </div>
              </>
            )}

            {/* Link para Login */}
            <div>
              <p className="text-gray-600 text-center text-sm">
                Já tem uma conta?{" "}
                <a href="/login" className="text-[#F55D22] font-bold">
                  Faça login aqui!
                </a>
              </p>
            </div>

            {/* Indicador Visual de Etapas */}
            <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-full w-max mx-auto px-4 py-2 shadow-inner">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    step === item
                      ? "w-8 bg-[#F55D22]"
                      : step > item
                        ? "w-3 bg-[#F55D22]"
                        : "w-3 bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            {/* Botões de Navegação */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => goToNextStep("previous")}
                  className="w-1/2 py-3 bg-gray-50 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  Voltar
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => goToNextStep("next")}
                  className={`${step === 1 ? "w-full" : "w-1/2"} py-3 bg-[#F55D22] text-white font-bold rounded-full hover:bg-[#ff4800] transition-colors`}
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // Olha como ficou simples! Ele só lê o Estado.
                    if (aceitouTermos === true) {
                      alert("Cadastro realizado com sucesso!");
                    } else {
                      alert(
                        "Por favor, aceite os Termos de Uso para finalizar o cadastro.",
                      );
                    }
                  }}
                  className="w-1/2 py-3 bg-[#F55D22] text-white font-bold rounded-full hover:bg-[#ff4800] transition-colors"
                >
                  Criar Conta
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormCadastro;
