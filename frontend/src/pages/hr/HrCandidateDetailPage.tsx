import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, FileText } from 'lucide-react';
import { HrShell } from './HrShell';
import { hrApi } from '../../api/hr.api';
import { BackButton } from '../../components/ui/BackButton';

const MAX_MESSAGES = 3;

export function HrCandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!id) return;
    hrApi.getCandidate(id).then(setCandidate);
    hrApi.getSentMessages(id).then(setMessages);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const send = async () => {
    if (!id || !draft.trim()) return;
    setSending(true);
    setError('');
    try {
      await hrApi.sendMessage({ candidateId: id, message: draft.trim() });
      setDraft('');
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  if (!candidate) return <HrShell><p className="text-ink-500">Loading…</p></HrShell>;

  const resume = candidate.resumes?.[0];
  const remaining = MAX_MESSAGES - messages.length;

  return (
    <HrShell>
      <BackButton to="/hr/candidates" label="Back to candidates" />

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{candidate.name}</h1>
          <p className="text-ink-500">{candidate.email}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(candidate.jobPreferences ?? []).map((p: any) => (
            <span key={p.id} className="badge text-signal-violet border-signal-violet/40">
              {p.roleName}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display font-semibold">
            <FileText size={18} className="text-signal-cyan" /> Resume insights
          </h2>
          {!resume ? (
            <p className="text-sm text-ink-500">No resume uploaded yet.</p>
          ) : (
            <>
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-4 inline-block text-sm text-signal-cyan hover:underline"
              >
                View original file: {resume.fileName}
              </a>
              <InsightBlock title="Skills" items={resume.skills} />
              <InsightBlock title="Technologies" items={resume.technologies} />
              {resume.experience?.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                    Experience
                  </h3>
                  <ul className="space-y-1 text-sm text-ink-300">
                    {resume.experience.map((exp: any, i: number) => (
                      <li key={i}>
                        {exp.title} @ {exp.company}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="panel p-6">
          <h2 className="mb-1 font-display font-semibold">Messages</h2>
          <p className="mb-4 text-xs text-ink-500">
            {remaining > 0 ? `${remaining} of ${MAX_MESSAGES} messages remaining` : 'Message limit reached for this candidate'}
          </p>

          <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-ink-500">No messages sent yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="rounded-lg border border-base-600 bg-base-900 p-3">
                  <p className="text-sm text-ink-100">{m.message}</p>
                  <p className="mt-1 font-mono text-xs text-ink-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {error && <p className="mb-2 text-sm text-signal-rose">{error}</p>}

          <div className="flex gap-2">
            <input
              className="input-field"
              placeholder="Write a short message…"
              value={draft}
              maxLength={500}
              disabled={remaining <= 0}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              disabled={sending || remaining <= 0 || !draft.trim()}
              className="btn-primary shrink-0 px-3"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </HrShell>
  );
}

function InsightBlock({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mb-4">
      <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-500">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="badge">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
