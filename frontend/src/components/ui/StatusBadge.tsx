const STATUS_STYLES: Record<string, string> = {
  APPLIED: 'text-signal-cyan border-signal-cyan/40',
  GOT_RESPONSE: 'text-signal-violet border-signal-violet/40',
  INTERVIEW_SCHEDULED: 'text-signal-amber border-signal-amber/40',
  REJECTED: 'text-signal-rose border-signal-rose/40',
  NO_RESPONSE: 'text-ink-500 border-base-600',
  CUSTOM_COMMENT: 'text-ink-300 border-base-600',
};

const STATUS_LABELS: Record<string, string> = {
  APPLIED: 'Applied',
  GOT_RESPONSE: 'Got response',
  INTERVIEW_SCHEDULED: 'Interview scheduled',
  REJECTED: 'Rejected',
  NO_RESPONSE: 'No response',
  CUSTOM_COMMENT: 'Comment',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${
        STATUS_STYLES[status] ?? 'text-ink-300 border-base-600'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
