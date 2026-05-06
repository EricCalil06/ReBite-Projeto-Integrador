import imagemPosterInicio from "../../assets/imagemPosterInicio.png";

function MainSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={imagemPosterInicio}
          alt="Poster Início"
          className="drop-shadow-xl hover:scale-105 transition-transform duration-500"
        />
      </div>
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
  );
}

export default MainSection;
