import { Pen, Barcode, LayoutGrid } from "lucide-react";
import bannerOnda from "../../assets/OndaFundo.png";

function Vantagens() {
  return (
    <section className="w-full">
      
      <div 
        className="w-full bg-cover bg-center bg-no-repeat pt-16 pb-36 md:pb-48 text-center px-6 text-white"
        style={{ backgroundImage: `url(${bannerOnda})` }}
      >

        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold leading-tight">
            Cansado de cadastrar produtos manualmente?
          </h2>
          <p className="text-sm md:text-lg font-medium max-w-3xl mx-auto">
            Montamos dois métodos novos de cadastros para te ajudar gastar menos tempo
            cadastrando e mais tempo <span className="font-extrabold text-white">VENDENDO!</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 md:-mt-40 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="flex flex-col items-start">

            <div className="bg-white text-gray-900 p-3.5 rounded-2xl shadow-md mb-3 ml-6 relative z-10 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-top-white">
              <Pen className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="bg-[#FFF5EC] p-6 pt-7 rounded-3xl border border-orange-100/50 shadow-sm min-h-[250px] w-full text-left">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Edição Manual</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                Assim como em todo lugar, também oferecemos essa opção para você cadastrar,
                editar e personalizar as informações dos seus produtos e loja como quiser.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start">

            <div className="bg-white text-gray-900 p-3.5 rounded-2xl shadow-md mb-3 ml-6 relative z-10 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-top-white">
              <Barcode className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="bg-[#FFF5EC] p-6 pt-7 rounded-3xl border border-orange-100/50 shadow-sm min-h-[250px] w-full text-left">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Código de Barras</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                Para produtos que possuem código de barras, com esse método é só você fazer o
                escaneamento do código de barras do produto e muitas partes do cadastro será
                preenchida automaticamente!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start">

            <div className="bg-white text-gray-900 p-3.5 rounded-2xl shadow-md mb-3 ml-6 relative z-10 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-top-white">
              <LayoutGrid className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="bg-[#FFF5EC] p-6 pt-7 rounded-3xl border border-orange-100/50 shadow-sm min-h-[250px] w-full text-left">
              <h3 className="font-bold text-xl text-gray-900 mb-3">Planilhas</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                Caso você já tenha uma planilha de controle, escolha essa opção. Formate ela de
                acordo com nossas instruções e suba ela dentro do painel da loja e os produtos serão
                adicionados automaticamente!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Vantagens;