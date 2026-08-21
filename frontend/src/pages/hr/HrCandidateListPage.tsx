import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { HrShell } from './HrShell';
import { hrApi } from '../../api/hr.api';
import { BackButton } from '../../components/ui/BackButton';

export function HrCandidateListPage() {
  const [skill, setSkill] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: any[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    hrApi
      .listCandidates({ skill: skill || undefined, role: role || undefined, page, limit: 10 })
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const runSearch = () => {
    setPage(1);
    load();
  };

  return (
    <HrShell>
      <BackButton to="/hr/dashboard" label="Back to dashboard" className="mb-4" />
      <h1 className="font-display text-2xl font-semibold">Candidates</h1>
      <p className="mt-1 text-ink-500">Search by skill or preferred job role.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          className="input-field max-w-xs"
          placeholder="Skill, e.g. React"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <input
          className="input-field max-w-xs"
          placeholder="Role, e.g. Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button onClick={runSearch} className="btn-secondary">
          <Search size={16} /> Search
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-ink-500">Loading…</p>
      ) : !data || data.items.length === 0 ? (
        <div className="panel mt-8 p-10 text-center text-ink-300">No candidates found.</div>
      ) : (
        <>
          <div className="mt-6 grid gap-3">
            {data.items.map((c) => (
              <Link
                key={c.id}
                to={`/hr/candidates/${c.id}`}
                className="panel flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:border-signal-violet/50"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-ink-500">{c.email}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(c.resumes?.[0]?.skills ?? []).slice(0, 5).map((s: string) => (
                    <span key={s} className="badge">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(c.jobPreferences ?? []).slice(0, 3).map((p: any) => (
                    <span key={p.id} className="badge text-signal-violet border-signal-violet/40">
                      {p.roleName}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-ink-500">
              Page {data ? page : 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} candidates
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary px-3 py-2 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data?.totalPages ?? 1, p + 1))}
                disabled={page >= (data?.totalPages ?? 1)}
                className="btn-secondary px-3 py-2 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </HrShell>
  );
}
