import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthLayout from '../shared/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/painel';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await logIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível iniciar sessão.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sessão" subtitle="Aceda ao painel da sua loja.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Senha</label>
            <Link to="/recuperar-senha" className="text-xs text-blue-400 hover:text-blue-300">
              Esqueceu-se?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="A sua senha"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Entrar
        </button>
      </form>

      <p className="text-sm text-slate-400 text-center mt-6">
        Ainda não tem loja?{' '}
        <Link to="/registar" className="text-blue-400 hover:text-blue-300 font-semibold">
          Criar conta grátis
        </Link>
      </p>
    </AuthLayout>
  );
}
