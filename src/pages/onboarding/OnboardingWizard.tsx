import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Store as StoreIcon,
  Shirt,
  UtensilsCrossed,
  Cookie,
  IceCream,
  Pill,
  BookOpen,
  Smartphone,
  Grid3x3,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useBusiness } from '../../hooks/useBusiness';
import { businessService, slugify } from '../../services/businessService';
import ImageUploader from '../dashboard/components/ImageUploader';
import { inputClass } from '../dashboard/components/FormField';
import {
  BUSINESS_TYPE_LABELS,
  THEME_COLORS,
  type BusinessType,
  type ThemeColor,
} from '../../models/business.model';
import { PLATFORM_NAME } from '../../config/platform';

const TYPE_ICONS: Record<BusinessType, typeof Shirt> = {
  moda: Shirt,
  restaurante: UtensilsCrossed,
  padaria: Cookie,
  sorvetes: IceCream,
  farmacia: Pill,
  papelaria: BookOpen,
  eletronicos: Smartphone,
  outros: Grid3x3,
};

const STEPS = ['Nome', 'Tipo', 'WhatsApp', 'Logo', 'Tema', 'Endereço', 'Concluir'] as const;

interface WizardState {
  name: string;
  businessType: BusinessType;
  whatsapp: string;
  logo: string;
  theme: ThemeColor;
  slug: string;
  slugEdited: boolean;
}

export default function OnboardingWizard() {
  const { business, loading, updateBusiness } = useBusiness();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<WizardState>({
    name: business?.name ?? '',
    businessType: 'outros',
    whatsapp: '',
    logo: '',
    theme: 'azul',
    slug: business?.slug ?? '',
    slugEdited: false,
  });

  if (loading || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const canAdvance = (): boolean => {
    if (step === 0) return state.name.trim().length > 1;
    if (step === 2) return true; // whatsapp opcional
    if (step === 5) return slugify(state.slug).length > 0;
    return true;
  };

  const goNext = () => {
    setError('');
    if (!canAdvance()) {
      setError('Preenche este campo para continuar.');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    setError('');
    const cleanSlug = slugify(state.slug);
    setSubmitting(true);
    try {
      const available = await businessService.isSlugAvailable(cleanSlug, business.id);
      if (!available) {
        setError('Este endereço já está em uso. Volta atrás e escolhe outro.');
        setSubmitting(false);
        setStep(5);
        return;
      }
      await updateBusiness({
        name: state.name.trim(),
        businessType: state.businessType,
        whatsapp: state.whatsapp.trim() || undefined,
        logo: state.logo || undefined,
        theme: state.theme,
        slug: cleanSlug,
        status: 'active',
      });
      navigate('/painel', { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível concluir a configuração.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <StoreIcon size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">{PLATFORM_NAME}</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  idx <= step ? 'bg-blue-500' : 'bg-white/10'
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">
          Passo {step + 1} de {STEPS.length} · {STEPS[step]}
        </p>

        <div className="glass-card rounded-2xl p-8 shadow-2xl min-h-[280px] flex flex-col">
          <div className="flex-1">
            {step === 0 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Como se chama a tua loja?</h1>
                <p className="text-sm text-slate-400 mb-6">É o nome que os teus clientes vão ver primeiro.</p>
                <input
                  autoFocus
                  type="text"
                  value={state.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Ex: Loja da Bianca"
                  className={inputClass}
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Qual é o teu ramo?</h1>
                <p className="text-sm text-slate-400 mb-6">Isto ajuda-nos a sugerir categorias mais tarde.</p>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(BUSINESS_TYPE_LABELS) as BusinessType[]).map((type) => {
                    const Icon = TYPE_ICONS[type];
                    const active = state.businessType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => update('businessType', type)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                          active
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-xs font-semibold">{BUSINESS_TYPE_LABELS[type]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Qual é o teu WhatsApp?</h1>
                <p className="text-sm text-slate-400 mb-6">
                  Os clientes vão usar este número para fazer encomendas. Podes deixar em branco e adicionar depois.
                </p>
                <input
                  autoFocus
                  type="tel"
                  value={state.whatsapp}
                  onChange={(e) => update('whatsapp', e.target.value)}
                  placeholder="+258 84 000 0000"
                  className={inputClass}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Adiciona o teu logótipo</h1>
                <p className="text-sm text-slate-400 mb-6">Opcional — podes adicionar mais tarde em Personalização.</p>
                <div className="w-32 mx-auto">
                  <ImageUploader
                    businessId={business.id}
                    context="logo"
                    images={state.logo ? [state.logo] : []}
                    onChange={(imgs) => update('logo', imgs[0] ?? '')}
                    maxImages={1}
                    aspect="aspect-square"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Escolhe um tema</h1>
                <p className="text-sm text-slate-400 mb-6">A cor principal da tua loja e do teu painel.</p>
                <div className="grid grid-cols-5 gap-3">
                  {(Object.keys(THEME_COLORS) as ThemeColor[]).map((theme) => {
                    const active = state.theme === theme;
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => update('theme', theme)}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className={`w-11 h-11 rounded-full flex items-center justify-center ring-offset-2 ring-offset-[#111c33] transition-all ${
                            active ? 'ring-2 ring-white' : ''
                          }`}
                          style={{ backgroundColor: THEME_COLORS[theme].primary }}
                        >
                          {active && <Check size={16} className="text-white" />}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize">{theme}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Endereço da tua loja</h1>
                <p className="text-sm text-slate-400 mb-6">O link que vais partilhar com os teus clientes.</p>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                  <span className="pl-4 text-sm text-slate-500 whitespace-nowrap">nexstore.app/loja/</span>
                  <input
                    type="text"
                    value={state.slug}
                    onChange={(e) => {
                      update('slugEdited', true);
                      update('slug', e.target.value);
                    }}
                    onFocus={() => {
                      if (!state.slugEdited && !state.slug) update('slug', slugify(state.name));
                    }}
                    placeholder="loja-da-bianca"
                    className="w-full bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <h1 className="text-xl font-bold text-white mb-1">Tudo pronto!</h1>
                <p className="text-sm text-slate-400 mb-6">Confirma os dados e publica a tua loja.</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
                    {state.logo ? (
                      <img src={state.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                    ) : (
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: THEME_COLORS[state.theme].primary }}
                      >
                        <StoreIcon size={16} className="text-white" />
                      </span>
                    )}
                    <div>
                      <p className="text-white font-semibold">{state.name || 'Sem nome'}</p>
                      <p className="text-slate-400 text-xs">
                        {BUSINESS_TYPE_LABELS[state.businessType]} · nexstore.app/loja/{slugify(state.slug)}
                      </p>
                    </div>
                  </div>
                  {state.whatsapp && (
                    <div className="flex justify-between bg-white/5 rounded-lg px-4 py-3">
                      <span className="text-slate-400">WhatsApp</span>
                      <span className="text-white">{state.whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-4">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-0 transition-colors"
            >
              <ChevronLeft size={16} /> Voltar
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg px-5 py-2.5 transition-colors"
              >
                Continuar <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm rounded-lg px-5 py-2.5 transition-colors"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Publicar a minha loja
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
