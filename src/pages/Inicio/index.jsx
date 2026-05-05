import { useState } from "react";
import imagemPosterInicio from "../../assets/imagemPosterInicio.png";
import bannerDesperdicio from "../../assets/bannerDesperdicio.png";

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
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={imagemPosterInicio} alt="Poster Início" />
        </div>

        {/* SEÇÃO: PRINCIPAL */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Descubra novas possibilidades. <br />
            Economize e evite o desperdício ao mesmo tempo!
          </h1>
          <p className="text-gray-600 text-lg">
            Comprar comida boa não significa pagar caro... <br />
            Ajude a não desperdiçar comida pagando bem menos.
          </p>
          <div className="pt-4">
            <p className="text-sm font-semibold mb-2">
              Comece a economizar agora!
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              BAIXAR APP
            </button>
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO: EXPLORE NOVAS OPÇÕES */}
      <section className="max-w-4xl mx-auto px-6 py-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Explore novas opções:</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-12">

          {/* Card 1 */}
          <button className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 w-full sm:w-1/2 hover:border-orange-500 transition-colors text-left">
            <div className="text-orange-500">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <span className="font-medium text-gray-700">
              Sacolas surpresas selecionadas com
              <br />
              categorias específicas
            </span>
          </button>

          {/* Card 2 */}
          <button className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 w-full sm:w-1/2 hover:border-orange-500 transition-colors text-left">
            <div className="text-orange-500">
              {/* Ícone de Livro/Catálogo (SVG) */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <span className="font-medium text-gray-700">
              Monte sua Sacola via
              <br />
              catálogo do lojista
            </span>
          </button>

        </div>
      </section>

      {/* 3. BANNER */}
      {/* Substituir o banner futuramente para uma imagem que fica de fundo e colocar textos por cima para fazer a animação do numero 55 crescendo */}
      <section className="w-full my-12">
        <img
          src={bannerDesperdicio}
          alt="55 Milhões de Toneladas de alimentos são jogadas fora todos os anos"
          className="w-full h-[500px] object-cover"
        />
      </section>

      {/* 4. SEÇÃO: COMO FUNCIONA? */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">COMO FUNCIONA?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card do Passo 1 */}
          <div className="border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="mb-4">
              <span className="text-5xl font-bold">1º</span>
              <span className="text-2xl font-bold ml-2">Escolha</span>
            </div>
            <p className="text-gray-600">
              Navegue pelo{" "}
              <span className="text-orange-500 font-bold">APP</span> e encontre{" "}
              <span className="text-orange-500 font-bold">
                sacolas surpresas
              </span>{" "}
              ou <span className="text-orange-500 font-bold">ofertas</span> de
              estabelecimentos perto de você.
            </p>
          </div>

          {/* Card do Passo 2 */}
          <div className="border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="mb-4">
              <span className="text-5xl font-bold">2º</span>
              <span className="text-2xl font-bold ml-2">Reserve</span>
            </div>
            <p className="text-gray-600">
              Garanta sua comida pelo{" "}
              <span className="text-orange-500 font-bold">APP</span> com{" "}
              <span className="text-orange-500 font-bold uppercase">
                descontassos
              </span>
            </p>
          </div>

          {/* Card do Passo 3 */}
          <div className="border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="mb-4">
              <span className="text-5xl font-bold">3º</span>
              <span className="text-2xl font-bold ml-2">Resgate</span>
            </div>
            <p className="text-gray-600">
              Vá até o local no{" "}
              <span className="text-orange-500 font-bold">
                horário indicado
              </span>{" "}
              e retire sua refeição deliciosa.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
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
