function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Container Principal do Rodapé dividido em 4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          {/* Coluna 1: A Marca */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold text-white mb-4">
              Re<span className="text-orange-500">Bite</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transformando desperdício em oportunidade. Conectamos lojistas a consumidores para um futuro mais sustentável e econômico.
            </p>
            {/* Ícones de Redes Sociais */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                {/* Ícone Instagram */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                {/* Ícone LinkedIn */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                {/* Ícone GitHub */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Como Funciona</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Para Lojistas</a></li>
            </ul>
          </div>

          {/* Coluna 3: Suporte & Legal */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-4">Suporte</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Central de Ajuda (FAQ)</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Fale Conosco</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Download do App */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-4">Baixe o App</h3>
            <p className="text-gray-400 text-sm mb-4">
              Disponível em breve para iOS e Android. Prepare-se para salvar os melhores pratos da sua região.
            </p>
            
          </div>

        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 ReBite. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-500">
            Projeto acadêmico desenvolvido por <span className="text-gray-300 font-medium">Eric e Pedro</span>.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;