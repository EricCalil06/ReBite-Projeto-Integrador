import { Link } from "react-router-dom";
import imagemCardCTA1 from "../../assets/ImagemCardCTA1.png";
import imagemCardCTA2 from "../../assets/ImagemCardCTA2.png";

function CardsCTA() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-12 md:gap-8">

                <div className="flex flex-col items-center text-center w-full md:w-1/2">
                    <div className="h-[280px] flex items-center justify-center mb-6 w-full">
                        <img
                            src={imagemCardCTA1}
                            alt="Bateu a fome e a vontade de economizar?"
                            className="max-h-full max-w-[320px] object-contain hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-4">
                        Bateu a fome e a <br />vontade de economizar?
                    </h2>
                    <p className="text-gray-700 mb-8 max-w-sm flex-grow">
                        Junte-se a milhares de pessoas que já estão comendo bem pagando muito menos. Salve refeições incríveis hoje mesmo.
                    </p>
                    <button className="bg-[#F05A28] hover:bg-[#d94f22] text-white font-semibold py-3 px-10 rounded-full transition-colors w-full sm:w-auto shadow-sm mt-auto">
                        BAIXAR APP
                    </button>
                </div>

                <div className="flex flex-col items-center text-center w-full md:w-1/2">
                    <div className="h-[280px] flex items-center justify-center mb-6 w-full">
                        <img
                            src={imagemCardCTA2}
                            alt="Comece a lucrar ainda hoje, ajudando a salvar alimentos"
                            className="max-h-full max-w-[320px] object-contain hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-4">
                        Comece a lucrar ainda hoje, ajudando a salvar alimentos
                    </h2>
                    <p className="text-gray-700 mb-8 max-w-sm flex-grow">
                        Junte-se a milhares de pessoas que já estão comendo bem pagando muito menos. Salve refeições incríveis hoje mesmo.
                    </p>
                    <Link
                        to="/cadastro-lojista"
                        className="bg-[#F05A28] hover:bg-[#d94f22] text-white font-semibold py-3 px-10 rounded-full transition-colors w-full sm:w-auto shadow-sm mt-auto text-center block sm:inline-block"
                    >
                        CADASTRAR UMA LOJA
                    </Link>
                </div>

            </div>
        </section>
    );
}

export default CardsCTA;