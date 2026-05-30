import { ShoppingBag, BookOpen } from "lucide-react";

function CardsLojistaFuncoes() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-8 text-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-950">Explore novas opções:</h2>
      <div className="flex flex-col sm:flex-row justify-center gap-12">

        <button className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 w-full sm:w-1/2 hover:border-orange-500 hover:shadow-sm transition-all text-left group">
          <div className="text-orange-500 bg-orange-50/50 p-2 rounded-xl group-hover:bg-orange-50 transition-colors">
            <ShoppingBag className="w-10 h-10 stroke-[1.75]" />
          </div>
          <span className="font-medium text-gray-700 text-base leading-snug">
            Sacolas surpresas com
            <br />
            categorias específicas
          </span>
        </button>

        <button className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 w-full sm:w-1/2 hover:border-orange-500 hover:shadow-sm transition-all text-left group">
          <div className="text-orange-500 bg-orange-50/50 p-2 rounded-xl group-hover:bg-orange-50 transition-colors">
            <BookOpen className="w-10 h-10 stroke-[1.75]" />
          </div>
          <span className="font-medium text-gray-700 text-base leading-snug">
            Monte sua Sacola via
            <br />
            catálogo do lojista
          </span>
        </button>

      </div>
    </section>
  );
}

export default CardsLojistaFuncoes;