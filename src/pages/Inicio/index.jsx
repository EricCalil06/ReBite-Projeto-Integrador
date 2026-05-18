import { useState } from "react";
import MainSection from "./mainSection";
import CardsSection from "./cardsSection";
import BannerSection from "./bannerSection";
import HowItWorksSection from "./howItWorksSection";
import CardsCTA from "./cardsCTA";

function Inicio() {
  // Lógica para fazer o FAQ abrir e fechar
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqData = [
    {
      question: "Minha entrega não veio certo, o que eu posso fazer?",
      answer:
        "Entre em contato pelo chat do aplicativo ou acesse a área de reports para relatar o problema. O lojista será notificado.",
    },
    {
      question: "Como eu faço para pagar as minhas compras?",
      answer:
        "Aceitamos PIX, cartões de crédito e débito diretamente pelo aplicativo com total segurança.",
    },
    {
      question: "Onde eu vejo os métodos de entrega da loja?",
      answer:
        "Na página de cada estabelecimento, antes de finalizar a compra, você verá se eles oferecem delivery ou apenas retirada no local.",
    },
    {
      question: "Perdi a senha da minha conta. O que eu posso fazer?",
      answer:
        "Na tela de login, clique em 'Esqueci minha senha' e enviaremos um link de recuperação para o seu e-mail.",
    },
    {
      question: "Para que serve o código de segurança nas entregas?",
      answer:
        "É a garantia de que você (ou o entregador) retirou a sacola correta. Basta informar os 4 números ao atendente.",
    },
  ];

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
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Precisa de ajuda?</h2>
          <p className="text-gray-600 text-lg">
            Confira o nosso FAQ e veja se sua dúvida esta aqui
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-[#FFFBF7] rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
              >
                <span className="font-medium text-gray-800 text-lg">
                  {item.question}
                </span>

                {/* TODO: Precisa arrumar isso aqui no próximo commit importando a biblioteca do LUCIDE */}
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {openFaq === index && (
                <div className="px-6 pb-5 text-gray-600">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Inicio;
