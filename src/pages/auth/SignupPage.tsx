import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthLayout from '../shared/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setSubmitting(true);
    try {
      await signUp(name, email, password);
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Criar a sua conta" subtitle="Comece a vender online em menos de 5 minutos.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Nome completo
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="O seu nome"
          />
        </div>
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
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Mínimo 6 caracteres"
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
          Criar conta grátis
        </button>
      </form>

      <p className="text-sm text-slate-400 text-center mt-6">
        Já tem conta?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
          Iniciar sessão
        </Link>
      </p>
    </AuthLayout>
  );
}
