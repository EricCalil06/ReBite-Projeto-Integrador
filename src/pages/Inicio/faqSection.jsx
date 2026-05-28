import { ChevronDown } from "lucide-react";

function FaqSection({ openFaq, toggleFaq }) {
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
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none group"
            >
              <span className="font-medium text-gray-800 text-lg group-hover:text-orange-500 transition-colors">
                {item.question}
              </span>

              <ChevronDown
                className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                  openFaq === index ? "rotate-180 text-orange-500" : ""
                }`}
              />
            </button>

            {openFaq === index && (
              <div className="px-6 pb-5 text-gray-600 transition-all">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;