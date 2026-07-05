/**
 * Business (a tenant/loja on the platform).
 * Supabase table: `businesses` (row id === Business.id).
 */

export type BusinessStatus = 'onboarding' | 'active' | 'suspended';
export type BusinessPlan = 'free' | 'pro';

export type BusinessType =
  | 'moda'
  | 'restaurante'
  | 'padaria'
  | 'sorvetes'
  | 'farmacia'
  | 'papelaria'
  | 'eletronicos'
  | 'outros';

export type ThemeColor = 'azul' | 'verde' | 'preto' | 'roxo' | 'vermelho';

export const THEME_COLORS: Record<ThemeColor, { primary: string; secondary: string }> = {
  azul: { primary: '#2563eb', secondary: '#1d4ed8' },
  verde: { primary: '#059669', secondary: '#047857' },
  preto: { primary: '#0f172a', secondary: '#1e293b' },
  roxo: { primary: '#7c3aed', secondary: '#6d28d9' },
  vermelho: { primary: '#dc2626', secondary: '#b91c1c' },
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  moda: 'Moda',
  restaurante: 'Restaurante',
  padaria: 'Padaria',
  sorvetes: 'Sorvetes',
  farmacia: 'Farmácia',
  papelaria: 'Papelaria',
  eletronicos: 'Eletrónicos',
  outros: 'Outros',
};

export interface Business {
  id: string; // businessId — matches the Supabase row id
  name: string;
  slug: string; // used in /loja/{slug}
  ownerId: string; // Supabase Auth user id of the owner
  businessType: BusinessType;
  logo?: string;
  banner?: string;
  description?: string;
  theme: ThemeColor;
  primaryColor?: string; // optional override of THEME_COLORS[theme]
  secondaryColor?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
  address?: string;
  status: BusinessStatus;
  plan: BusinessPlan;
  createdAt: string;
  updatedAt: string;
}

/** Shape used when a business is first auto-created right after sign-up. */
export type NewBusinessDraft = Pick<Business, 'ownerId' | 'name' | 'slug'>;
