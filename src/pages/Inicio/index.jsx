import { useState } from "react";
import MainSection from "./mainSection";
import CardsSection from "./cardsSection";
import BannerSection from "./bannerSection";
import HowItWorksSection from "./howItWorksSection";
import CardsCTA from "./cardsCTA";
import FaqSection from "./faqSection";

function Inicio() {
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
      {/* 1. SEÇÃO PRINCIPAL */}
      <MainSection />

      {/* SEÇÃO: EXPLORE NOVAS OPÇÕES */}
      <CardsSection />

      {/* 3. BANNER */}
      {/* Substituir o banner futuramente para uma imagem que fica de fundo e colocar textos por cima para fazer a animação do numero 55 crescendo */}
      <BannerSection />

      {/* 4. Cards CTA*/}
      {/* Cards que chamam os clientes para dentro do APP tanto como lojista quanto como usuário */}
      <CardsCTA />

      {/* 5. SEÇÃO: COMO FUNCIONA? */}
      <HowItWorksSection />

      {/* 6. FAQ */}
      <FaqSection openFaq={openFaq} toggleFaq={toggleFaq} />
    </div>
  );
}

export default Inicio;
