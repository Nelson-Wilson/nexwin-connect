import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Botão flutuante "Voltar ao Painel", visível apenas quando quem está a ver
 * a loja pública é o próprio dono (sessão activa com businessId igual ao
 * desta loja). Para qualquer outro visitante — a maioria — este componente
 * não renderiza nada.
 *
 * Existe porque o link "Ver loja" no painel abre em nova aba (target=
 * "_blank") no desktop, mas em contexto de PWA/mobile pode abrir na mesma
 * janela, deixando o dono sem forma óbvia de voltar ao sistema.
 */
export default function StoreOwnerReturnBar({ businessId }: { businessId: string }) {
  const { platformUser } = useAuth();

  if (!platformUser || platformUser.businessId !== businessId) return null;

  return (
    <Link
      to="/painel"
      className="fixed top-4 left-4 z-[60] inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5"
    >
      <LayoutDashboard className="w-3.5 h-3.5" />
      Voltar ao Painel
    </Link>
  );
}
