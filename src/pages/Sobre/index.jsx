import imagemPosterInicio from "../../assets/imagemPosterInicio.png";

function Sobre() {

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* Seção: O que é o ReBite */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Muito mais que um app, <br />
            <span className="text-orange-500">um movimento contra o desperdício.</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Nós somos o ReBite. Nascemos de uma inquietação muito simples: por que tanta comida perfeita vai parar no lixo todos os dias, enquanto tanta gente quer comer bem e pagar menos?
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            O ReBite é a ponte que resolve esse problema. Conectamos padarias, restaurantes e mercados que possuem alimentos excedentes no fim do dia a pessoas com fome de economia. É bom para o seu bolso, é ótimo para o lojista e é essencial para o planeta.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src={imagemPosterInicio} 
            alt="Sacola de alimentos frescos do ReBite" 
            className="w-full max-w-md object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Seção: Por que escolher o ReBite? */}
      <section className="bg-[#FFFBF7] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a gente?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A gente sabe que cada pessoa tem um gosto e uma rotina diferente. Ao contrário de outros aplicativos, aqui nós te damos o poder de escolha.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Card 1 */}
            <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Gosta de surpresas?</h3>
              <p className="text-gray-600">
                Resgate nossas famosas <strong className="text-gray-800">Sacolas Surpresas</strong>. O lojista seleciona os melhores itens excedentes do dia e você leva um pacotão de comida boa para casa por um valor simbólico. Ideal para quem adora descobrir novos sabores.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Prefere ter o controle?</h3>
              <p className="text-gray-600">
                Sem problemas! Com a opção <strong className="text-gray-800">Monte sua Sacola</strong>, você navega pelo catálogo da loja e escolhe exatamente os produtos que quer salvar. Você no comando total do que vai comer e do quanto vai economizar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: CTA */}
      {/* Vou colocar dois CTAs aqui. Se não for necessário eu mudo depois */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Faça parte da mudança</h2>
          <p className="text-gray-600">O desperdício só acaba quando todos trabalham juntos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CTA Usuário */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between items-start relative overflow-hidden">
            <div className="z-10 relative">
              <span className="uppercase tracking-wider text-sm font-bold text-orange-400 mb-4 block">Para você</span>
              <h3 className="text-3xl font-bold mb-4">Bateu a fome e a vontade de economizar?</h3>
              <p className="text-gray-400 mb-8 max-w-sm">
                Junte-se a milhares de pessoas que já estão comendo bem pagando muito menos. Salve refeições incríveis hoje mesmo.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                BAIXAR O APP
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* CTA Lojista */}
          <div className="bg-orange-50 rounded-[2.5rem] p-10 text-gray-900 flex flex-col justify-between items-start border border-orange-100">
            <div>
              <span className="uppercase tracking-wider text-sm font-bold text-orange-600 mb-4 block">Para o seu negócio</span>
              <h3 className="text-3xl font-bold mb-4">Transforme desperdício em nova receita.</h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                Não jogue mais o seu lucro no lixo. Cadastre seu estabelecimento de forma gratuita, recupere seus custos e atraia novos clientes para a sua loja.
              </p>
              <button className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl transition-colors">
                CADASTRAR MINHA LOJA
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Sobre;