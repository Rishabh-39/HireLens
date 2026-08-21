import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-950 bg-grid-fade px-4 text-center">
      <p className="font-mono text-sm text-signal-cyan">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Signal lost</h1>
      <p className="mt-2 text-ink-500">This page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
