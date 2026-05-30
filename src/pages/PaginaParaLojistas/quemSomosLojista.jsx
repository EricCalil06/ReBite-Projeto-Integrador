import imagemQuemSomos from "../../assets/imagemQuemSomos.png";

function QuemSomos() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
      
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-950">
          O que é o ReBite?
        </h2>
        <p className="text-gray-800 text-lg leading-relaxed font-normal">
          Surgimos como mais uma solução para ajudar pessoas, estabelecimentos e o
          mundo. Notamos que há um desperdício muito grande de comida e nosso objetivo é
          proporcionar ao máximo de pessoas possível que elas acessem determinadas
          comidas em boa qualidade que iriam ser descartadas, assim evitando o
          desperdício.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex justify-end">
        <img
          src={imagemQuemSomos}
          alt="Ilustração do ecossistema ReBite combatendo o desperdício"
          className="w-full max-w-lg object-contain drop-shadow-xl hover:scale-102 transition-transform duration-500"
        />
      </div>

    </section>
  );
}

export default QuemSomos;
