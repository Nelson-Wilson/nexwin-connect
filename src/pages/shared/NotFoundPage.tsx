import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-display font-bold text-blue-600/40">404</p>
      <p className="text-slate-500">Página não encontrada.</p>
      <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
        Voltar ao início
      </Link>
    </div>
  );
}
