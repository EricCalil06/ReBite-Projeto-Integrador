import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/loginImage.png";
import logoReBiteH from "../../assets/logoReBiteH.png";

function FormCadastro({ step, goToNextStep }) {
  const navigate = useNavigate();
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    telefone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, ""),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalize = async () => {
    if (!aceitouTermos) {
      alert("Por favor, aceite os Termos de Uso para finalizar o cadastro.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Erro no cadastro:", errorData.error);
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="relative z-10 flex w-full max-w-7xl p-6 items-center gap-8">
      {/* Imagem Lateral */}
      <div className="w-[50%] flex justify-center">
        <img src={loginImage} alt="Ilustração" className="w-[100%]" />
      </div>

      {/* Caixa do Formulário */}
      <div className="w-[50%] flex justify-center">
        <div className="bg-white rounded-[2rem] shadow-xl p-10 w-full max-w-md">
          <img src={logoReBiteH} alt="Logo" className="w-32 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Crie sua conta
          </h2>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite seu nome completo"
                    className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu e-mail"
                    className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F55D22]"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-sm text-gray-600">
                    <strong>Nome:</strong> {formData.nome}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Data de Nascimento:</strong>{" "}
                    {formData.dataNascimento}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>E-mail:</strong> {formData.email}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Telefone:</strong> {formData.telefone}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-2 mt-2">
                  <input
                    type="checkbox"
                    id="termos"
                    className="w-4 h-4 accent-[#F55D22]"
                    checked={aceitouTermos}
                    onChange={(e) => setAceitouTermos(e.target.checked)}
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
            <p className="text-gray-600 text-center text-sm">
              Já tem uma conta?{" "}
              <a href="/login" className="text-[#F55D22] font-bold">
                Faça login!
              </a>
            </p>

            <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-full w-max mx-auto px-4 py-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-3 rounded-full transition-all duration-300 ${step === item ? "w-8 bg-[#F55D22]" : step > item ? "w-3 bg-[#F55D22]" : "w-3 bg-gray-300"}`}
                ></div>
              ))}
            </div>

            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => goToNextStep("previous")}
                  className="w-1/2 py-3 bg-gray-50 text-gray-700 font-bold rounded-full border border-gray-300"
                >
                  Voltar
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => goToNextStep("next")}
                  className={`${step === 1 ? "w-full" : "w-1/2"} py-3 bg-[#F55D22] text-white font-bold rounded-full`}
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalize}
                  className="w-1/2 py-3 bg-[#F55D22] text-white font-bold rounded-full"
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
