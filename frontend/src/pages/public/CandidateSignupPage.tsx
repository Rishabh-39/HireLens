import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthCard } from '../../components/ui/AuthCard';
import { FormField } from '../../components/ui/FormField';
import { authApi } from '../../api/auth.api';
import { BackButton } from '../../components/ui/BackButton';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';

export function CandidateSignupPage() {
  const [name, setName] = useState('');
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
      const data = await authApi.registerCandidate({ name, email, password });
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Signup failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start matching your resume to real roles"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-signal-cyan hover:underline">
            Log in
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
        <FormField label="Full name">
          <input
            required
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </FormField>
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
        <FormField label="Password" error={password && password.length < 8 ? 'Minimum 8 characters' : undefined}>
          <input
            type="password"
            required
            minLength={8}
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </FormField>
        <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-ink-500">
        Hiring instead?{' '}
        <Link to="/hr/signup" className="text-signal-violet hover:underline">
          Go to HR signup
        </Link>
      </p>
    </AuthCard>
  );
}
