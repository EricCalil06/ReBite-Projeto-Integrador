import { useState } from "react";
import loginImage from "../../assets/loginImage.png";
import logoReBiteH from "../../assets/logoReBiteH.png";
import FormCadastro from "./formCadastro";

{/* 
    
    Por enquanto a página de cadastro não tem nada a mais do que a página de login
    Nos próximos commits, vou adicionar outros campos assim como etapas dentro do cadastro
    
*/}

// const [step, setStep] = useState(1);

// function nextStep({ step }) {
//   const nextStep = step++
//   const previousStep = step--

//   if(previousStep <= 1){
//     previousStep = 1

//   }
// }

function Cadastro() {
  return (
    // Contêiner do fundo
    <div className="h-[92%] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-[45%] h-[150%] bg-[#f7b094] rounded-r-full -translate-y-40"></div>

        {/* Formulário de Cadastro */}
        <FormCadastro />        
    </div>
  );
}

export default Cadastro;
