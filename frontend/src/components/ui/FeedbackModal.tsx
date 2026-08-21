import { useState } from 'react';
import { X } from 'lucide-react';
import { feedbackApi, type FeedbackStatus } from '../../api/feedback.api';

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'GOT_RESPONSE', label: 'Got response' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview scheduled' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'NO_RESPONSE', label: 'No response' },
  { value: 'CUSTOM_COMMENT', label: 'Custom comment' },
];

export function FeedbackModal({
  careerLinkId,
  companyName,
  onClose,
  onSaved,
}: {
  careerLinkId: string;
  companyName: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<FeedbackStatus>('APPLIED');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await feedbackApi.create({ careerLinkId, status, comment: comment || undefined });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-950/80 backdrop-blur-sm px-4">
      <div className="panel w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Feedback for {companyName}</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-100">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                status === opt.value
                  ? 'border-signal-cyan bg-signal-cyan/10 text-signal-cyan'
                  : 'border-base-600 text-ink-300 hover:border-base-600/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <textarea
          className="input-field min-h-[80px] resize-none"
          placeholder="Optional comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={submit} disabled={saving} className="btn-primary mt-4 w-full">
          {saving ? 'Saving…' : 'Save feedback'}
        </button>
      </div>
    </div>
  );
}
