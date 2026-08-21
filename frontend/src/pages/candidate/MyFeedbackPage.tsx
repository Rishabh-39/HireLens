import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { CandidateShell } from './CandidateShell';
import { feedbackApi } from '../../api/feedback.api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BackButton } from '../../components/ui/BackButton';

export function MyFeedbackPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackApi
      .getMine()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CandidateShell>
      <BackButton to="/dashboard" label="Back to dashboard" className="mb-4" />
      <h1 className="font-display text-2xl font-semibold">My feedback</h1>
      <p className="mt-1 text-ink-500">Everything you've logged about your applications.</p>

      {loading ? (
        <p className="mt-8 text-ink-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="panel mt-8 p-10 text-center text-ink-300">
          No feedback logged yet — add some from the career feed.
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {items.map((fb) => (
            <div key={fb.id} className="panel flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium capitalize">{fb.careerLink.companyName}</h3>
                  <StatusBadge status={fb.status} />
                </div>
                {fb.comment && <p className="mt-1 text-sm text-ink-300">{fb.comment}</p>}
                <a
                  href={fb.careerLink.careerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-1 text-xs text-signal-cyan hover:underline"
                >
                  View listing <ExternalLink size={10} />
                </a>
              </div>
              <span className="shrink-0 font-mono text-xs text-ink-500">
                {new Date(fb.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </CandidateShell>
  );
}
