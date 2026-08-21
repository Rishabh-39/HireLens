import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 bg-grid-fade px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold"
        >
          <span className="h-2 w-2 rounded-full bg-signal-cyan animate-pulseDot" />
          HireLens
        </Link>

        <div className="panel p-8">
          <h1 className="mb-1 font-display text-2xl font-semibold">{title}</h1>
          <p className="mb-6 text-sm text-ink-500">{subtitle}</p>
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">{footer}</p>
      </div>
    </div>
  );
}
