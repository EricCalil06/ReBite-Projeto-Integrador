function CardsSection() {
  return (
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
  );
}

export default CardsSection;
