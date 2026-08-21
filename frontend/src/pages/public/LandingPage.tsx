import { Link } from 'react-router-dom';
import { Radar, ScanLine, MessagesSquare, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-base-950 bg-grid-fade text-ink-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal-cyan animate-pulseDot" />
          <span className="font-display text-lg font-semibold tracking-tight">HireLens</span>
        </div>
        <nav className="flex items-center gap-3 font-mono text-sm">
          <Link to="/login" className="text-ink-300 hover:text-ink-100">
            Candidate
          </Link>
          <span className="text-base-600">/</span>
          <Link to="/hr/login" className="text-ink-300 hover:text-ink-100">
            HR
          </Link>
        </nav>
      </header>

      <section className="scan-surface relative mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="scan-sweep absolute inset-0" />
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-signal-cyan">
          Resume in → signal out
        </p>
        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Your resume, decoded into the roles worth chasing.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-300">
          HireLens reads your resume with Gemini, matches it against the role you want, and
          scans the web for the exact career pages to apply to — then tracks what actually gets
          responses.
        </p>
        {/* <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/signup" className="btn-primary">
            Find my roles <ArrowRight size={16} />
          </Link>
          <Link to="/hr/signup" className="btn-secondary">
            I'm hiring
          </Link>
        </div> */}
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        <FeatureCard
          icon={Radar}
          title="AI resume scan"
          body="Gemini extracts your skills, education, experience, and stack from any PDF or DOCX in seconds."
        />
        <FeatureCard
          icon={ScanLine}
          title="Live career feed"
          body="We search the open web for real company career pages matched to your role and skillset."
        />
        <FeatureCard
          icon={MessagesSquare}
          title="Community signal"
          body="See how other candidates fared at each company — applied, interviewed, ghosted — before you apply."
        />
      </section>

      <footer className="border-t border-base-700/60 px-6 py-8 text-center font-mono text-xs text-ink-500">
        I built HireLens to help candidates spend less time searching and more time finding opportunities that actually matter.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Radar;
  title: string;
  body: string;
}) {
  return (
    <div className="panel p-6">
      <Icon className="mb-4 text-signal-cyan" size={22} />
      <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-ink-300">{body}</p>
    </div>
  );
}
