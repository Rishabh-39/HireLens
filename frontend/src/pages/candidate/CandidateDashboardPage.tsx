import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Radar, MessagesSquare, ArrowRight } from 'lucide-react';
import { CandidateShell } from './CandidateShell';
import { usersApi } from '../../api/users.api';
import { useAppSelector } from '../../hooks/redux';

export function CandidateDashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    usersApi.getMe().then(setProfile).catch(() => {});
  }, []);

  const resumeCount = profile?.resumes?.length ?? 0;
  const preferenceCount = profile?.jobPreferences?.length ?? 0;
  const latestResume = profile?.resumes?.[0];

  return (
    <CandidateShell>
      <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-ink-500">Here's where your job search stands.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-500">Resumes uploaded</p>
          <p className="mt-2 font-display text-3xl font-semibold text-signal-cyan">{resumeCount}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-500">Job preferences</p>
          <p className="mt-2 font-display text-3xl font-semibold text-signal-violet">{preferenceCount}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-500">Latest resume status</p>
          <p className="mt-2 font-display text-xl font-semibold">
            {latestResume ? latestResume.status : '—'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <QuickAction
          to="/dashboard/resume"
          icon={FileUp}
          title="Upload resume"
          body="Let Gemini extract your skills and experience."
        />
        <QuickAction
          to="/dashboard/feed"
          icon={Radar}
          title="Scan the career feed"
          body="Search the web for career pages matching your role."
        />
        <QuickAction
          to="/dashboard/messages"
          icon={MessagesSquare}
          title="Check HR messages"
          body="See if any recruiters have reached out."
        />
      </div>
    </CandidateShell>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string;
  icon: typeof FileUp;
  title: string;
  body: string;
}) {
  return (
    <Link to={to} className="panel group flex flex-col p-5 transition-colors hover:border-signal-cyan/50">
      <Icon className="mb-3 text-signal-cyan" size={20} />
      <h3 className="font-display font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-ink-500">{body}</p>
      <span className="mt-3 flex items-center gap-1 text-sm text-signal-cyan opacity-0 transition-opacity group-hover:opacity-100">
        Go <ArrowRight size={14} />
      </span>
    </Link>
  );
}
