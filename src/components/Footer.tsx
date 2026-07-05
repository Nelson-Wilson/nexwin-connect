import { Phone, Mail, MapPin, Instagram, Facebook, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-white/5 text-xs py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="font-display font-bold text-sm text-white">B</span>
              </div>
              <span className="font-display font-black text-base tracking-tighter text-white uppercase">
                CANTINHO DA <span className="text-blue-500">BIANCA</span>
              </span>
            </div>
            
            <p className="font-light leading-relaxed max-w-sm text-slate-400">
              O seu catálogo digital premium para vestuário sofisticado, calçados elegantes e o verdadeiro, artesanal e nutritivo Yougurt de Malambe. Encomende diretamente pelo WhatsApp!
            </p>

            {/* Social Grid */}
            <div className="flex gap-2.5 pt-1">
              <a href="https://wa.me/258866473065" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white border border-slate-800/80 flex items-center justify-center text-slate-400 transition-all cursor-pointer">
                <Phone size={14} className="fill-current" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600 hover:text-white border border-slate-800/80 flex items-center justify-center text-slate-400 transition-all cursor-pointer">
                <Instagram size={14} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white border border-slate-800/80 flex items-center justify-center text-slate-400 transition-all cursor-pointer">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest">Navegação</h4>
            <ul className="space-y-2.5 font-light">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">Produtos</a>
              </li>
              <li>
                <a href="#sorvete-malambe" className="hover:text-white transition-colors">Yougurt de Malambe</a>
              </li>
              <li>
                <a href="#promocoes" className="hover:text-white transition-colors">Promoções 🔥</a>
              </li>
              <li>
                <a href="#contactos" className="hover:text-white transition-colors">Contactos</a>
              </li>
            </ul>
          </div>

          {/* Quick Contact Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest">Atendimento</h4>
            <ul className="space-y-3 font-light text-slate-400">
              <li className="flex gap-2 items-center">
                <Phone size={14} className="text-blue-500" />
                <a href="https://wa.me/258866473065" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  +258 86 647 3065
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail size={14} className="text-blue-500" />
                <a href="mailto:contacto@malambemoda.com" className="hover:text-white transition-colors">
                  contacto@malambemoda.com
                </a>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin size={14} className="text-blue-500 mt-0.5" />
                <span>Av. Eduardo Mondlane, Maputo, Moçambique</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details & Back to top button */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <div>
            <span>© 2026 <strong>Cantinho da Bianca</strong>. Todos os direitos reservados.</span>
            <span className="block sm:inline sm:ml-2 text-[10px] text-slate-600">• Desenvolvido para Vendas WhatsApp</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="Voltar ao Topo"
          >
            <span>Voltar ao topo</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
}
