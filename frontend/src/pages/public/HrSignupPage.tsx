import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthCard } from '../../components/ui/AuthCard';
import { FormField } from '../../components/ui/FormField';
import { authApi } from '../../api/auth.api';
import { BackButton } from '../../components/ui/BackButton';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';

export function HrSignupPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
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
      const data = await authApi.registerHr({ name, email, password, company });
      dispatch(setCredentials(data));
      navigate('/hr/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Signup failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create an HR account"
      subtitle="Search candidates, view resumes, and reach out directly"
      footer={
        <>
          Already registered?{' '}
          <Link to="/hr/login" className="text-signal-violet hover:underline">
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
            placeholder="Jordan Lee"
          />
        </FormField>
        <FormField label="Company">
          <input
            required
            className="input-field"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corp"
          />
        </FormField>
        <FormField label="Work email">
          <input
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
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
        <button type="submit" disabled={loading} className="btn-secondary mt-2 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  );
}
