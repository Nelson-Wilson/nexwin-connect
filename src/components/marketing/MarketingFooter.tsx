import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { BrandMark } from './MarketingHeader';

const COLUMNS = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', href: '#' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Funcionalidades', href: '#funcionalidades' },
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Exemplos de Lojas', href: '#exemplos' },
    ],
  },
  {
    title: 'Planos',
    links: [
      { label: 'Preços', href: '#precos' },
      { label: 'Criar Loja Grátis', href: '/registar' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { label: 'Entrar', href: '/login' },
      { label: 'Recuperar Senha', href: '/recuperar-senha' },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer id="contacto" className="bg-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <BrandMark light />
            <p className="text-slate-400 text-sm mt-4 max-w-xs leading-relaxed">
              A plataforma que ajuda pequenos e médios negócios de Moçambique a vender online, pelo WhatsApp, sem complicações.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              {[
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: MessageCircle, href: 'https://wa.me/258866473065', label: 'WhatsApp' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-slate-300 hover:text-white"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-white text-sm font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} NexWin Connect. Todos os direitos reservados.</p>
          <p className="text-slate-500 text-xs">Feito em Moçambique 🇲🇿</p>
        </div>
      </div>
    </footer>
  );
}
