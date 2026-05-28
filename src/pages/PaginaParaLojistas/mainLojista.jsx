import ImagemCTA_02 from "../../assets/imagemCardCTA2.png";

function MainSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={ImagemCTA_02}
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

        <form action="">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="rounded-xl pl-4 bg-white border border-gray-300 placeholder:text-gray-500
               text-gray-900 focus:ring-orange-500 focus:border-orange-500"
            />
            
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              Cadastrar e-mail
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default MainSection;
