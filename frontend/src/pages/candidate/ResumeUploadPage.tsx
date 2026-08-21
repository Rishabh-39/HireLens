import { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { CandidateShell } from './CandidateShell';
import { resumeApi } from '../../api/resume.api';
import { BackButton } from '../../components/ui/BackButton';

export function ResumeUploadPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => resumeApi.getMine().then(setResumes).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleFile = async (file: File) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('Only PDF and DOCX files are supported.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      await resumeApi.upload(file);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const latest = resumes[0];

  return (
    <CandidateShell>
      <BackButton to="/dashboard" label="Back to dashboard" className="mb-4" />
      <h1 className="font-display text-2xl font-semibold">Resume</h1>
      <p className="mt-1 text-ink-500">Upload a PDF or DOCX — Gemini extracts your profile automatically.</p>

      <div
        onDragOver={(e) => (e.preventDefault(), setDragOver(true))}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`panel mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 border-dashed py-16 text-center transition-colors ${
          dragOver ? 'border-signal-cyan bg-signal-cyan/5' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {uploading ? (
          <Loader2 className="animate-spin text-signal-cyan" size={28} />
        ) : (
          <UploadCloud className="text-signal-cyan" size={28} />
        )}
        <p className="font-medium">
          {uploading ? 'Uploading & analyzing…' : 'Drop your resume here, or click to browse'}
        </p>
        <p className="text-xs text-ink-500">PDF or DOCX, up to 5MB</p>
      </div>

      {error && <p className="mt-3 text-sm text-signal-rose">{error}</p>}

      {latest && (
        <div className="panel mt-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-signal-cyan" size={20} />
              <div>
                <p className="font-medium">{latest.fileName}</p>
                <p className="text-xs text-ink-500">
                  Uploaded {new Date(latest.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <StatusPill status={latest.status} />
          </div>

          {latest.status === 'PROCESSED' && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <InsightList title="Skills" items={latest.skills} />
              <InsightList title="Technologies" items={latest.technologies} />
              {latest.education?.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                    Education
                  </h3>
                  <ul className="space-y-1.5 text-sm text-ink-300">
                    {latest.education.map((edu: any, i: number) => (
                      <li key={i}>
                        {edu.degree} — {edu.institution} {edu.year && `(${edu.year})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {latest.experience?.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                    Experience
                  </h3>
                  <ul className="space-y-1.5 text-sm text-ink-300">
                    {latest.experience.map((exp: any, i: number) => (
                      <li key={i}>
                        {exp.title} @ {exp.company} {exp.duration && `· ${exp.duration}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </CandidateShell>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
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

function StatusPill({ status }: { status: string }) {
  if (status === 'PROCESSED')
    return (
      <span className="flex items-center gap-1.5 text-sm text-signal-cyan">
        <CheckCircle2 size={16} /> Processed
      </span>
    );
  if (status === 'FAILED')
    return (
      <span className="flex items-center gap-1.5 text-sm text-signal-rose">
        <XCircle size={16} /> Failed
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-sm text-signal-amber">
      <Loader2 size={16} className="animate-spin" /> Processing
    </span>
  );
}
