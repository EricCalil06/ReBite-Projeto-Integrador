function HowItWorksSection() {
  return (
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
                descontaços
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
        );
}

export default HowItWorksSection;
