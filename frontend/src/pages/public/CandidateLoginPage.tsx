import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthCard } from '../../components/ui/AuthCard';
import { FormField } from '../../components/ui/FormField';
import { authApi } from '../../api/auth.api';
import { BackButton } from '../../components/ui/BackButton';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';

export function CandidateLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.loginCandidate({ email, password });
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your candidate dashboard"
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-signal-cyan hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <BackButton to="/" label="Back" className="mb-4" />
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-signal-rose/30 bg-signal-rose/10 px-3 py-2 text-sm text-signal-rose">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <FormField label="Email">
          <input
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FormField>
        <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-ink-500">
        Hiring instead?{' '}
        <Link to="/hr/login" className="text-signal-violet hover:underline">
          Go to HR login
        </Link>
      </p>
    </AuthCard>
  );
}
