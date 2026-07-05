import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useBusiness } from '../../../hooks/useBusiness';
import { BUSINESS_TYPE_LABELS, type BusinessType } from '../../../models/business.model';
import { FormField, inputClass } from '../components/FormField';

const BUSINESS_TYPES = Object.keys(BUSINESS_TYPE_LABELS) as BusinessType[];

export default function SettingsPage() {
  const { platformUser } = useAuth();
  const { business, updateBusiness } = useBusiness();
  const [name, setName] = useState(business?.name ?? '');
  const [businessType, setBusinessType] = useState<BusinessType>(business?.businessType ?? 'outros');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!business) return null;

  const handleSave = async () => {
    setSaving(true);
    await updateBusiness({ name: name.trim(), businessType });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-1">Configurações</h1>
      <p className="text-sm text-slate-400 mb-8">Dados da loja e da tua conta.</p>

      <div className="glass-card rounded-xl p-6 space-y-4 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Identidade da loja</p>
        <FormField label="Nome da loja">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </FormField>
        <FormField label="Tipo de negócio">
          <select value={businessType} onChange={(e) => setBusinessType(e.target.value as BusinessType)} className={inputClass}>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#0F172A]">{BUSINESS_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </FormField>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Guardar
          </button>
          {saved && <span className="text-sm text-emerald-400 font-semibold">Guardado ✓</span>}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Conta</p>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Email</span>
          <span className="text-white">{platformUser?.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Função</span>
          <span className="text-white capitalize">{platformUser?.role === 'owner' ? 'Proprietário' : 'Equipa'}</span>
        </div>
        <Link to="/recuperar-senha" className="inline-block text-sm text-blue-400 hover:text-blue-300 font-semibold pt-2">
          Alterar senha
        </Link>
      </div>
    </div>
  );
}
