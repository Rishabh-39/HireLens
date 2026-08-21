import { useEffect, useState } from 'react';
import { ExternalLink, Radar, Loader2, MessageCircle } from 'lucide-react';
import { CandidateShell } from './CandidateShell';
import { jobDiscoveryApi } from '../../api/job-discovery.api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { FeedbackModal } from '../../components/ui/FeedbackModal';
import { BackButton } from '../../components/ui/BackButton';

export function CareerFeedPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [activeLink, setActiveLink] = useState<{ id: string; company: string } | null>(null);

  const loadFeed = () => {
    setLoading(true);
    jobDiscoveryApi
      .getFeed()
      .then(setFeed)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const runSearch = async () => {
    setSearching(true);
    try {
      await jobDiscoveryApi.search(roleFilter || undefined);
      loadFeed();
    } finally {
      setSearching(false);
    }
  };

  return (
    <CandidateShell>
      <BackButton to="/dashboard" label="Back to dashboard" className="mb-4" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Career feed</h1>
          <p className="mt-1 text-ink-500">Live career pages matched to your role and skills.</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input-field w-56"
            placeholder="Override role (optional)"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
          <button onClick={runSearch} disabled={searching} className="btn-primary shrink-0">
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Radar size={16} />}
            Scan
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-ink-500">Loading feed…</p>
      ) : feed.length === 0 ? (
        <div className="panel mt-8 p-10 text-center">
          <Radar className="mx-auto mb-3 text-ink-500" size={28} />
          <p className="text-ink-300">No career links yet.</p>
          <p className="mt-1 text-sm text-ink-500">
            Set a preferred role in your profile, then hit "Scan" to search the web.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {feed.map((link) => (
            <div key={link.id} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold capitalize">{link.companyName}</h3>
                  <span className="badge">{link.roleName}</span>
                </div>
                <a
                  href={link.careerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-1 truncate text-sm text-signal-cyan hover:underline"
                >
                  {link.careerUrl} <ExternalLink size={12} className="shrink-0" />
                </a>
                {link.feedbacks?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {link.feedbacks.slice(0, 4).map((fb: any) => (
                      <StatusBadge key={fb.id} status={fb.status} />
                    ))}
                    {link.feedbacks.length > 4 && (
                      <span className="text-xs text-ink-500">+{link.feedbacks.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveLink({ id: link.id, company: link.companyName })}
                className="btn-secondary shrink-0"
              >
                <MessageCircle size={16} /> Add feedback
              </button>
            </div>
          ))}
        </div>
      )}

      {activeLink && (
        <FeedbackModal
          careerLinkId={activeLink.id}
          companyName={activeLink.company}
          onClose={() => setActiveLink(null)}
          onSaved={loadFeed}
        />
      )}
    </CandidateShell>
  );
}
