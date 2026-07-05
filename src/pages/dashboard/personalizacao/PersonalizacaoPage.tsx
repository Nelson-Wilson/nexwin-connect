import { useState } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import { useBusiness } from '../../../hooks/useBusiness';
import ImageUploader from '../components/ImageUploader';
import { FormField, inputClass } from '../components/FormField';
import { THEME_COLORS, type ThemeColor } from '../../../models/business.model';

export default function PersonalizacaoPage() {
  const { business, updateBusiness } = useBusiness();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [logo, setLogo] = useState<string[]>(business?.logo ? [business.logo] : []);
  const [banner, setBanner] = useState<string[]>(business?.banner ? [business.banner] : []);
  const [theme, setTheme] = useState<ThemeColor>(business?.theme ?? 'azul');
  const [description, setDescription] = useState(business?.description ?? '');
  const [whatsapp, setWhatsapp] = useState(business?.whatsapp ?? '');
  const [instagram, setInstagram] = useState(business?.instagram ?? '');
  const [facebook, setFacebook] = useState(business?.facebook ?? '');
  const [email, setEmail] = useState(business?.email ?? '');
  const [address, setAddress] = useState(business?.address ?? '');

  if (!business) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await updateBusiness({
      logo: logo[0] ?? undefined,
      banner: banner[0] ?? undefined,
      theme,
      description: description.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      instagram: instagram.trim() || undefined,
      facebook: facebook.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-1">Personalização</h1>
      <p className="text-sm text-slate-400 mb-8">A identidade visual da tua loja pública.</p>

      <div className="space-y-6">
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Logótipo e capa</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Logótipo">
              <div className="w-28">
                <ImageUploader businessId={business.id} context="logo" images={logo} onChange={setLogo} maxImages={1} />
              </div>
            </FormField>
            <FormField label="Banner da loja" hint="Aparece no topo da tua loja pública.">
              <ImageUploader
                businessId={business.id}
                context="banner"
                images={banner}
                onChange={setBanner}
                maxImages={1}
                aspect="aspect-video"
              />
            </FormField>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Tema</p>
          <div className="grid grid-cols-5 gap-3 max-w-xs">
            {(Object.keys(THEME_COLORS) as ThemeColor[]).map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center ring-offset-2 ring-offset-[#111c33] transition-all ${
                      active ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: THEME_COLORS[t].primary }}
                  >
                    {active && <Check size={14} className="text-white" />}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Sobre a loja</p>
          <FormField label="Descrição">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma breve descrição da tua loja..."
              className={`${inputClass} resize-none`}
            />
          </FormField>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Contactos e redes sociais</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="WhatsApp">
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+258 84 000 0000" className={inputClass} />
            </FormField>
            <FormField label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="loja@email.com" className={inputClass} />
            </FormField>
            <FormField label="Instagram">
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@aloja" className={inputClass} />
            </FormField>
            <FormField label="Facebook">
              <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="facebook.com/aloja" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Endereço">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, bairro, cidade" className={inputClass} />
          </FormField>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm rounded-lg px-5 py-2.5 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Guardar alterações
        </button>
        {saved && <span className="text-sm text-emerald-400 font-semibold">Guardado ✓</span>}
      </div>
    </div>
  );
}
