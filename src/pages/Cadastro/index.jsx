import { useState } from "react";
import loginImage from "../../assets/loginImage.png";
import logoReBiteH from "../../assets/logoReBiteH.png";
import FormCadastro from "./formCadastro";

function Cadastro() {
  const [step, setStep] = useState(1);

  function goToNextStep(action) {
    if (action === "next" && step < 3) {
      setStep((prev) => prev + 1);
    } else if (action === "previous" && step > 1) {
      setStep((prev) => prev - 1);
    }
  }

  return (
    // Contêiner do fundo
    <div className="h-[92%] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-[45%] h-[150%] bg-[#f7b094] rounded-r-full -translate-y-40"></div>

      {/* Formulário de Cadastro */}
      <FormCadastro goToNextStep={goToNextStep} step={step} />
    </div>
  );
}

export default Cadastro;
