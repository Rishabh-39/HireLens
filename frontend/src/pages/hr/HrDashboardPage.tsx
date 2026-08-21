import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { HrShell } from './HrShell';
import { hrApi } from '../../api/hr.api';
import { useAppSelector } from '../../hooks/redux';

export function HrDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    hrApi.listCandidates({ page: 1, limit: 1 }).then((data) => setTotal(data.total));
  }, []);

  return (
    <HrShell>
      <h1 className="font-display text-2xl font-semibold">Welcome, {user?.name?.split(' ')[0]}</h1>
      {user?.company && (
        <p className="mt-0.5 text-sm font-medium text-signal-violet">{user.company}</p>
      )}
      <p className="mt-1 text-ink-500">Search and reach out to candidates on HireLens.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-500">Candidates on platform</p>
          <p className="mt-2 font-display text-3xl font-semibold text-signal-violet">
            {total ?? '—'}
          </p>
        </div>
        <Link
          to="/hr/candidates"
          className="panel group flex flex-col justify-between p-5 transition-colors hover:border-signal-violet/50 md:col-span-2"
        >
          <div className="flex items-center gap-3">
            <Users className="text-signal-violet" size={22} />
            <div>
              <h3 className="font-display font-semibold">Browse candidates</h3>
              <p className="mt-1 text-sm text-ink-500">
                Filter by skill or preferred role, view resumes and AI insights.
              </p>
            </div>
          </div>
          <span className="mt-4 flex items-center gap-1 text-sm text-signal-violet opacity-0 transition-opacity group-hover:opacity-100">
            Go to candidates <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </HrShell>
  );
}
