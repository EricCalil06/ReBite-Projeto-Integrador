import MainLojista from "./mainLojista";
import QuemSomos from "./quemSomosLojista";
import Vantagens from "./vantagensLojista";
import CardsLojistaFuncoes from "./cardsLojistaFuncoes";
import FaqSection from "./faqSection";
import { useState } from "react";

function PaginaLojista() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Main Section - Lojista */}
      <MainLojista />

      {/* Quem Somos - Lojista */}
      <QuemSomos />

      {/* Vantagens - Lojista */}
      <Vantagens />

      {/* Outras Funções - Lojista */}
      <CardsLojistaFuncoes />

      {/* 6. FAQ - Lojista */}
      <FaqSection openFaq={openFaq} toggleFaq={toggleFaq} />
    </div>
  );
}

export default PaginaLojista;
