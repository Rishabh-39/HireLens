import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { CandidateShell } from './CandidateShell';
import { hrApi } from '../../api/hr.api';
import { BackButton } from '../../components/ui/BackButton';

export function HrMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hrApi
      .getInbox()
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CandidateShell>
      <BackButton to="/dashboard" label="Back to dashboard" className="mb-4" />
      <h1 className="font-display text-2xl font-semibold">HR messages</h1>
      <p className="mt-1 text-ink-500">Messages recruiters have sent you directly.</p>

      {loading ? (
        <p className="mt-8 text-ink-500">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="panel mt-8 p-10 text-center">
          <Mail className="mx-auto mb-3 text-ink-500" size={28} />
          <p className="text-ink-300">No messages yet.</p>
          <p className="mt-1 text-sm text-ink-500">
            Keep your resume and preferences up to date to get noticed.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium">{msg.hr.name}</p>
                <span className="font-mono text-xs text-ink-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-300">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </CandidateShell>
  );
}
