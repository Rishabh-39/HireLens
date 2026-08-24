import { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
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

  // Helper to get skills from a resume (check both direct fields and extractedData JSON)
  const getSkills = (resume: any): string[] => {
    if (resume.skills && Array.isArray(resume.skills) && resume.skills.length > 0) {
      return resume.skills;
    }
    // Fallback: check extractedData JSON
    if (resume.extractedData && typeof resume.extractedData === 'object') {
      const data = resume.extractedData;
      if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
        return data.skills;
      }
    }
    return [];
  };

  const getTechnologies = (resume: any): string[] => {
    if (resume.technologies && Array.isArray(resume.technologies) && resume.technologies.length > 0) {
      return resume.technologies;
    }
    if (resume.extractedData && typeof resume.extractedData === 'object') {
      const data = resume.extractedData;
      if (data.technologies && Array.isArray(data.technologies) && data.technologies.length > 0) {
        return data.technologies;
      }
    }
    return [];
  };

  const getEducation = (resume: any): any[] => {
    if (resume.education && Array.isArray(resume.education) && resume.education.length > 0) {
      return resume.education;
    }
    if (resume.extractedData && typeof resume.extractedData === 'object') {
      const data = resume.extractedData;
      if (data.education && Array.isArray(data.education) && data.education.length > 0) {
        return data.education;
      }
    }
    return [];
  };

  const getExperience = (resume: any): any[] => {
    if (resume.experience && Array.isArray(resume.experience) && resume.experience.length > 0) {
      return resume.experience;
    }
    if (resume.extractedData && typeof resume.extractedData === 'object') {
      const data = resume.extractedData;
      if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
        return data.experience;
      }
    }
    return [];
  };

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

      {/* ── My Resumes Section ── */}
      {resumes.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold mb-4">My Resumes</h2>

          <div className="space-y-6">
            {resumes.map((resume: any) => {
              const skills = getSkills(resume);
              const technologies = getTechnologies(resume);
              const education = getEducation(resume);
              const experience = getExperience(resume);
              const hasAnalysis = skills.length > 0 || technologies.length > 0 || education.length > 0 || experience.length > 0;

              return (
                <div key={resume.id} className="panel p-6">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-signal-cyan" size={20} />
                      <div>
                        <p className="font-medium">{resume.fileName}</p>
                        <p className="text-xs text-ink-500">
                          Uploaded {new Date(resume.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={resume.status} />
                  </div>

                  {/* Skills & Analysis */}
                  {resume.status === 'PROCESSED' && hasAnalysis && (
                    <div className="mt-6 space-y-5">
                      {/* Skills Section */}
                      {skills.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="text-signal-violet" size={16} />
                            <h3 className="font-mono text-xs uppercase tracking-wider text-ink-500">
                              Skills
                            </h3>
                            <span className="ml-1 rounded-full bg-signal-violet/10 px-2 py-0.5 text-[10px] font-semibold text-signal-violet">
                              {skills.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill: string) => (
                              <span key={skill} className="badge">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technologies Section */}
                      {technologies.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-mono text-xs uppercase tracking-wider text-ink-500">
                              Technologies
                            </h3>
                            <span className="ml-1 rounded-full bg-signal-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-signal-cyan">
                              {technologies.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {technologies.map((tech: string) => (
                              <span key={tech} className="badge">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education Section */}
                      {education.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                            Education
                          </h3>
                          <ul className="space-y-1.5 text-sm text-ink-300">
                            {education.map((edu: any, i: number) => (
                              <li key={i}>
                                {edu.degree} — {edu.institution} {edu.year && `(${edu.year})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Experience Section */}
                      {experience.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                            Experience
                          </h3>
                          <ul className="space-y-1.5 text-sm text-ink-300">
                            {experience.map((exp: any, i: number) => (
                              <li key={i}>
                                {exp.title} @ {exp.company} {exp.duration && `· ${exp.duration}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status messages for non-processed resumes */}
                  {resume.status === 'FAILED' && (
                    <p className="mt-4 text-sm text-signal-rose">
                      Analysis failed. Please try uploading again.
                    </p>
                  )}
                  {resume.status === 'PENDING' && (
                    <p className="mt-4 text-sm text-signal-amber">
                      Your resume is being analyzed…
                    </p>
                  )}
                  {resume.status === 'PROCESSED' && !hasAnalysis && (
                    <p className="mt-4 text-sm text-ink-500">
                      No skills or data could be extracted. Try uploading a text-based PDF (not a scanned image).
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </CandidateShell>
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

