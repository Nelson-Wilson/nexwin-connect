import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Instagram, Facebook, Send, CheckCircle2 } from 'lucide-react';
import { ContactForm } from '../types';

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call or save message
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Olá! Meu nome é ${formData.name || 'Cliente'}.
E-mail: ${formData.email || 'Não informado'}
Telemóvel: ${formData.phone || 'Não informado'}
Mensagem: ${formData.message || 'Gostaria de obter mais informações sobre o vosso catálogo.'}`;
    
    window.open(`https://wa.me/258866473065?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contactos" className="py-24 bg-[#0F172A] text-white relative border-t border-white/5">
      {/* Background glow lights */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Fale connosco</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Contactos & <span className="font-sans font-black not-italic tracking-tighter uppercase">Localização</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm">
            Tem alguma dúvida? Entre em contacto connosco por e-mail ou diretamente no WhatsApp para atendimento imediato.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-display font-bold text-xl text-white mb-6">Informações de Contacto</h3>
            
            {/* WhatsApp */}
            <div className="p-5 rounded-2xl glass-card border border-slate-900 flex gap-4 items-center">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Phone size={18} className="fill-emerald-400/10" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">WhatsApp Oficial</span>
                <a href="https://wa.me/258866473065" target="_blank" rel="noreferrer" className="block font-display font-bold text-base text-white hover:text-emerald-400 transition-colors">
                  +258 86 647 3065
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-2xl glass-card border border-slate-900 flex gap-4 items-center">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">E-mail</span>
                <a href="mailto:contacto@malambemoda.com" className="block font-display font-bold text-base text-white hover:text-blue-400 transition-colors">
                  contacto@malambemoda.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 rounded-2xl glass-card border border-slate-900 flex gap-4 items-center">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Localização</span>
                <span className="block font-display font-bold text-sm sm:text-base text-slate-200">
                  Av. Eduardo Mondlane, Maputo, Moçambique
                </span>
              </div>
            </div>

            {/* Social Media Grid */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Siga as nossas Redes</h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-all cursor-pointer"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right panel: Form card */}
          <div className="lg:col-span-7 rounded-3xl glass-card border border-slate-900/80 p-6 sm:p-8 relative">
            <h3 className="font-display font-bold text-xl text-white mb-6">Envie uma Mensagem</h3>

            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-scaleUp">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="font-display font-bold text-lg text-white">Mensagem Enviada!</h4>
                <p className="text-xs text-slate-400 max-w-sm font-light">
                  Agradecemos o seu contacto. A nossa equipa irá analisar os seus dados e responder o mais breve possível.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seu Nome</label>
                    <input
                      type="text"
                      placeholder="Ex: Ana Maria"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Telemóvel (Opcional)</label>
                    <input
                      type="tel"
                      placeholder="Ex: +258 86 647 3065"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seu E-mail</label>
                  <input
                    type="email"
                    placeholder="Ex: maria@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-900 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mensagem ou Encomenda</label>
                  <textarea
                    rows={4}
                    placeholder="Escreva a sua mensagem, dúvida ou detalhe do produto que deseja encomendar..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-900 text-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Send size={14} />
                    Enviar Formulário
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    disabled={!formData.name || !formData.message}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Phone size={14} className="fill-white" />
                    Enviar pelo WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
