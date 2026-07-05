import { MessageCircle, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function StoreContact() {
  const { business, accent, whatsappLink } = useStore();
  const wa = whatsappLink('Olá! Gostaria de mais informações.');

  const items = [
    wa && { icon: MessageCircle, label: 'WhatsApp', value: business.whatsapp, href: wa },
    business.email && { icon: Mail, label: 'Email', value: business.email, href: `mailto:${business.email}` },
    business.address && { icon: MapPin, label: 'Endereço', value: business.address, href: undefined },
    business.instagram && { icon: Instagram, label: 'Instagram', value: business.instagram, href: `https://instagram.com/${business.instagram.replace('@', '')}` },
    business.facebook && { icon: Facebook, label: 'Facebook', value: business.facebook, href: business.facebook.startsWith('http') ? business.facebook : `https://${business.facebook}` },
  ].filter(Boolean) as { icon: typeof MessageCircle; label: string; value: string; href?: string }[];

  if (items.length === 0) return null;

  return (
    <section id="contactos" className="py-16 bg-[#0F172A] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Fale connosco</span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-2 mb-10 tracking-tight">Contactos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="glass-card rounded-xl p-5 flex items-center gap-4 text-left hover:-translate-y-0.5 transition-transform">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}22`, color: accent }}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-white truncate">{item.value}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{content}</a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
