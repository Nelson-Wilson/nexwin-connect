import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../shared/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível enviar o email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Recuperar senha" subtitle="Enviamos-lhe um link para redefinir a sua senha.">
      {sent ? (
        <div className="text-center py-4">
          <CheckCircle2 className="mx-auto text-emerald-400 mb-3" size={32} />
          <p className="text-sm text-slate-300">
            Se existir uma conta com o email <span className="text-white font-semibold">{email}</span>, enviámos
            as instruções de recuperação.
          </p>
        </div>
      ) : (
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
            Enviar link de recuperação
          </button>
        </form>
      )}

      <p className="text-sm text-slate-400 text-center mt-6">
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  );
}
