/**
 * Componente de footer
 * Exibe informações sobre a empresa e links úteis
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Doces Delícia</h3>
            <p className="text-sm">
              Sua doceria online com os melhores doces e guloseimas. Entrega rápida e qualidade garantida.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Serviço
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 contato@docesdelicia.com</li>
              <li>📱 (11) 9999-9999</li>
              <li>📍 São Paulo, SP</li>
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            © {currentYear} Doces Delícia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
