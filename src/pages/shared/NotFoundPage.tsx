import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-display font-bold text-blue-500/40">404</p>
      <p className="text-slate-400">Página não encontrada.</p>
      <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold text-sm">
        Voltar ao início
      </Link>
    </div>
  );
}
