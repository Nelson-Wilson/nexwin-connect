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
          <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={32} />
          <p className="text-sm text-slate-600">
            Se existir uma conta com o email <span className="text-slate-900 font-semibold">{email}</span>, enviámos
            as instruções de recuperação.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="voce@email.com"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Enviar link de recuperação
          </button>
        </form>
      )}

      <p className="text-sm text-slate-500 text-center mt-6">
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  );
}
